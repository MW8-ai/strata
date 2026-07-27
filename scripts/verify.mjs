#!/usr/bin/env node
/**
 * Referential and policy gate.
 *
 * Zod validates each entry in isolation at build time. This script checks
 * what a per-file schema cannot see: references across files, mutual
 * consistency of the two status axes, and the policy rules that make the
 * landing page trustworthy.
 *
 * Exit non-zero on failure. Wired into `npm run build`, so a broken
 * reference or an unsupported "recommended" never reaches Pages.
 */
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { parse } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src', 'content');
const SCENES = ['context-window', 'concurrency-cas', 'consolidation'];

const failures = [];
const warnings = [];
const fail = (f, m) => failures.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

async function load(name) {
  const dir = join(CONTENT, name);
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  return Promise.all(
    files.map(async (f) => {
      const raw = await readFile(join(dir, f), 'utf8');
      // Tolerate CRLF. A Windows checkout with the default core.autocrlf hands
      // us "---\r\n", and an LF-only pattern reports every file in the archive
      // as missing its frontmatter, which reads as 60 content failures rather
      // than as one line-ending problem.
      const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!m) { fail(f, 'missing YAML frontmatter'); return { id: basename(f, '.md'), file: f, data: {} }; }
      let data = {};
      try { data = parse(m[1]) ?? {}; } catch (e) { fail(f, `unparseable frontmatter: ${e.message}`); }
      return { id: basename(f, '.md'), file: f, data };
    })
  );
}

const [methods, events, topics, vendors] = await Promise.all([
  load('methods'), load('events'), load('topics'), load('vendors'),
]);
const methodIds = new Set(methods.map((m) => m.id));
const eventIds = new Set(events.map((e) => e.id));
const today = new Date().toISOString().slice(0, 10);

const refCheck = (file, list, label) => {
  for (const r of list ?? []) if (!methodIds.has(r)) fail(file, `${label} reference "${r}" not found`);
};

for (const { id, file, data } of methods) {
  refCheck(file, data.superseded_by, 'superseded_by');
  refCheck(file, data.used_with, 'used_with');
  refCheck(file, data.replaces, 'replaces');

  for (const e of data.evidence ?? []) if (!eventIds.has(e)) fail(file, `evidence reference "${e}" not found`);
  if (data.scene && !SCENES.includes(data.scene)) fail(file, `scene "${data.scene}" is not registered`);

  // Status axes must agree with each other and with the evidence.
  if (data.lifecycle === 'superseded' && (data.superseded_by ?? []).length === 0)
    fail(file, 'lifecycle "superseded" without superseded_by');
  if (data.lifecycle === 'current' && (data.superseded_by ?? []).length > 0)
    fail(file, 'cannot be current and superseded at once');
  if (['superseded', 'withdrawn'].includes(data.lifecycle) && !data.sunset)
    fail(file, `lifecycle "${data.lifecycle}" requires a sunset date`);
  if (data.maturity === 'recommended' && data.verification === 'unknown')
    fail(file, 'maturity "recommended" cannot rest on verification "unknown"');

  // Supersession must be mutual in direction: if A says B supersedes it,
  // B must not also claim A supersedes B.
  for (const r of data.superseded_by ?? []) {
    const other = methods.find((m) => m.id === r);
    if ((other?.data.superseded_by ?? []).includes(id))
      fail(file, `circular supersession with "${r}"`);
  }

  if (data.verification === 'verified' && !(data.sources ?? []).some((s) => s.tier === 'official'))
    fail(file, 'verification "verified" without an official-tier source');
  for (const s of data.sources ?? [])
    if (s.retrieved_at > today) fail(file, `retrieved_at ${s.retrieved_at} is in the future`);

  // Evaluation honesty. A method with no listed weakness has been advertised.
  if (!(data.evaluation?.weak ?? []).length) fail(file, 'evaluation.weak is empty');
  if (!(data.evaluation?.good ?? []).length) fail(file, 'evaluation.good is empty');

  // Anything shown on the landing page as a current default should carry
  // operational caveats. Silence there is almost always incompleteness.
  if (data.lifecycle === 'current' && (data.caveats ?? []).length === 0)
    warn(file, 'current-lifecycle method with no caveats on file');
  if (data.review?.status === 'reviewed' && !data.review?.date)
    fail(file, 'review status "reviewed" requires a date');
}

for (const { file, data } of events) {
  if (data.method && !methodIds.has(data.method)) fail(file, `method reference "${data.method}" not found`);
  if (data.verification === 'verified' && !(data.sources ?? []).some((s) => s.tier === 'official'))
    fail(file, 'verification "verified" without an official-tier source');
}

// Topics: coverage claims must match the methods actually listed, and every
// method should be reachable from at least one topic or the map has a hole.
const claimed = new Set();
for (const { file, data } of topics) {
  for (const m of data.methods ?? []) {
    if (!methodIds.has(m)) fail(file, `method reference "${m}" not found`);
    else claimed.add(m);
  }
  if (data.coverage === 'covered' && (data.methods ?? []).length === 0)
    fail(file, 'coverage "covered" with no methods listed');
  if (data.coverage === 'gap' && (data.methods ?? []).length > 0)
    fail(file, 'coverage "gap" cannot list methods; use "partial"');
  if (data.coverage === 'gap' && (data.open_questions ?? []).length === 0)
    fail(file, 'a gap with no open questions is an omission, not a gap');
  if (!String(data.question ?? '').trim().endsWith('?'))
    fail(file, 'topic.question must be phrased as a question');
}
for (const m of methods)
  if (!claimed.has(m.id)) warn(m.file, 'not referenced by any topic; the topic map has a hole');

// Every critical caveat must carry a concrete check. A critical warning you
// cannot test is an opinion with an alarming label on it. This was a warning
// while the backlog was being cleared; the backlog is clear, so it is a gate
// now, matching hard rule 6 in CLAUDE.md.
for (const { file, data } of methods)
  for (const c of data.caveats ?? [])
    if (c.severity === 'critical' && !c.check)
      fail(file, `critical caveat (${c.scope}) has no "check"`);

// Security and permissioning are the scopes where an untestable caveat does the
// most damage, so they carry the same requirement regardless of severity.
for (const { file, data } of methods)
  for (const c of data.caveats ?? [])
    if (['security', 'permissioning'].includes(c.scope) && c.severity !== 'critical' && !c.check)
      warn(file, `${c.scope} caveat (${c.severity}) has no "check"`);

for (const { file, data } of vendors) {
  if (data.current_default && !methodIds.has(data.current_default))
    fail(file, `current_default "${data.current_default}" not found`);
  if (!data.current_default) warn(file, 'no current_default; landing page will render "unknown, not none"');
}

const counts = (key, vals) =>
  vals.map((v) => `${v}:${methods.filter((m) => m.data[key] === v).length}`).join('  ');

console.log(`methods: ${methods.length}   events: ${events.length}   topics: ${topics.length}   vendors: ${vendors.length}`);
console.log(`topics    ` + ['covered','partial','gap'].map(c=>`${c}:${topics.filter(t=>t.data.coverage===c).length}`).join('  '));
console.log(`lifecycle  ${counts('lifecycle', ['current', 'additive', 'superseded', 'withdrawn'])}`);
console.log(`maturity   ${counts('maturity', ['recommended', 'preview', 'development', 'prototype'])}`);
console.log(`unreviewed: ${methods.filter((m) => m.data.review?.status === 'unreviewed').length}`);
console.log(`critical caveats: ${methods.reduce((n, m) => n + (m.data.caveats ?? []).filter((c) => c.severity === 'critical').length, 0)}`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log('\nverify: pass');
