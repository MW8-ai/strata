#!/usr/bin/env node
/**
 * Feed lane collector.
 *
 * Collects titles, links, and dates only. It deliberately does not store
 * article bodies or summaries: this repository is public, the sources are
 * copyrighted, and a one-line description written by a human at promotion
 * time is worth more than a scraped abstract anyway.
 *
 * Failure is expected. Vendor feeds move without notice, so every source
 * carries health state and the workflow fails loudly when a source has
 * returned nothing for several consecutive runs.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FEED_DIR = join(ROOT, 'data', 'feed');
const EMPTY_RUNS_BEFORE_ALARM = 3;
const TIMEOUT_MS = 20_000;

const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));

/** Minimal RSS/Atom extraction. Kept dependency-free on purpose. */
function parseItems(xml, sourceId) {
  const blocks = [
    ...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi),
    ...xml.matchAll(/<entry[\s>][\s\S]*?<\/entry>/gi),
  ].map((m) => m[0]);

  return blocks
    .map((block) => {
      const pick = (tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
        if (!m) return '';
        return m[1]
          .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim();
      };

      const linkAttr = block.match(/<link[^>]*href=["']([^"']+)["']/i);
      const url = linkAttr ? linkAttr[1] : pick('link');
      const published = pick('pubDate') || pick('published') || pick('updated') || '';
      const iso = published ? new Date(published).toISOString() : null;

      return { source_id: sourceId, title: pick('title'), url, published: iso };
    })
    .filter((i) => i.title && i.url);
}

function matchesKeywords(item, keywords) {
  const hay = item.title.toLowerCase();
  return keywords.some((k) => hay.includes(k.toLowerCase()));
}

async function fetchWithTimeout(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'user-agent': 'strata-feed-collector (+https://github.com/MW8-ai/strata)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const config = await readJson(join(FEED_DIR, 'sources.json'));
  let previous = { items: [], health: {} };
  try {
    previous = await readJson(join(FEED_DIR, 'latest.json'));
  } catch {
    /* first run */
  }

  const health = { ...(previous.health ?? {}) };
  const collected = [];
  const alarms = [];

  for (const source of config.sources) {
    const prior = health[source.id] ?? { consecutive_empty: 0, last_ok: null, last_error: null };
    try {
      const xml = await fetchWithTimeout(source.url);
      const items = parseItems(xml, source.id).filter((i) => matchesKeywords(i, config.keywords));
      collected.push(...items);

      health[source.id] = {
        consecutive_empty: items.length === 0 ? prior.consecutive_empty + 1 : 0,
        last_ok: new Date().toISOString(),
        last_error: null,
        last_count: items.length,
      };
      console.log(`[ok]   ${source.id} -> ${items.length} matching item(s)`);
    } catch (err) {
      health[source.id] = {
        consecutive_empty: prior.consecutive_empty + 1,
        last_ok: prior.last_ok,
        last_error: String(err?.message ?? err),
        last_count: 0,
      };
      console.log(`[fail] ${source.id} -> ${err?.message ?? err}`);
    }

    if (health[source.id].consecutive_empty >= EMPTY_RUNS_BEFORE_ALARM) {
      alarms.push(`${source.id} has returned nothing for ${health[source.id].consecutive_empty} runs`);
    }
  }

  // Stable identity so re-runs do not duplicate. URL is the natural key.
  const seen = new Set();
  const merged = [...collected, ...(previous.items ?? [])]
    .filter((i) => {
      if (seen.has(i.url)) return false;
      seen.add(i.url);
      return true;
    })
    .sort((a, b) => String(b.published ?? '').localeCompare(String(a.published ?? '')))
    .slice(0, 400);

  const payload = { generated_at: new Date().toISOString(), items: merged, health };
  await writeFile(join(FEED_DIR, 'latest.json'), `${JSON.stringify(payload, null, 2)}\n`);

  const stamp = new Date().toISOString().slice(0, 7);
  await mkdir(join(FEED_DIR, 'archive'), { recursive: true });
  await writeFile(
    join(FEED_DIR, 'archive', `${stamp}.json`),
    `${JSON.stringify({ generated_at: payload.generated_at, items: merged }, null, 2)}\n`
  );

  console.log(`\n${merged.length} item(s) held.`);
  if (alarms.length) {
    console.error('\nSource health alarms:');
    alarms.forEach((a) => console.error(`  - ${a}`));
    process.exitCode = 2; // surfaces in CI without discarding the collected data
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
