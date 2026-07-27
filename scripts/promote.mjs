#!/usr/bin/env node
/**
 * Feed lane -> canonical lane scaffold.
 *
 * Usage: node scripts/promote.mjs "<substring of the feed item title>"
 *
 * This intentionally produces an INCOMPLETE file. It fills in only what the
 * machine actually knows: the title, the date, and the URL. Why and how are
 * left as TODO because they are the parts that require a person to read the
 * source and think. An entry that skips them is a press release, not a
 * timeline entry, and `npm run verify` will not let it pass as verified.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const needle = process.argv.slice(2).join(' ').trim();

if (!needle) {
  console.error('Usage: node scripts/promote.mjs "<part of the feed item title>"');
  process.exit(1);
}

const feed = JSON.parse(await readFile(join(ROOT, 'data', 'feed', 'latest.json'), 'utf8'));
const matches = (feed.items ?? []).filter((i) =>
  i.title.toLowerCase().includes(needle.toLowerCase())
);

if (matches.length === 0) {
  console.error(`No feed item matches "${needle}".`);
  process.exit(1);
}
if (matches.length > 1) {
  console.error(`Ambiguous. ${matches.length} items match:`);
  matches.forEach((m) => console.error(`  - ${m.title}`));
  process.exit(1);
}

const item = matches[0];
const date = (item.published ?? new Date().toISOString()).slice(0, 10);
const slug = `${date.slice(0, 7)}-${item.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 48)}`;
const target = join(ROOT, 'src', 'content', 'events', `${slug}.md`);

try {
  await access(target);
  console.error(`${slug}.md already exists. Edit it instead.`);
  process.exit(1);
} catch {
  /* good, it is new */
}

const body = `---
date: "${date}"
date_precision: "day"
actors: ["TODO"]
title: ${JSON.stringify(item.title.slice(0, 120))}
what: "TODO one sentence, mechanism first, no marketing language"
why: "TODO which limit of the previous approach forced this"
how: "TODO the actual mechanism, specific enough to argue with"
where: "blog"
primitive_class: "file-as-memory"
primitives: []
verification: "unknown"
sources:
  - url: ${JSON.stringify(item.url)}
    title: ${JSON.stringify(item.title.slice(0, 120))}
    tier: "reputable"
    publisher: "${item.source_id}"
    retrieved_at: "${new Date().toISOString().slice(0, 10)}"
edges: []
provisional: true
---

TODO. Read the source. Write the entry body in your own words.

Do not paste the announcement. Do not paraphrase it closely. State what changed, what it
replaces, and what it does not solve. If you cannot say what it does not solve, you have
not finished reading.

Before setting verification to "verified": find a first-party source, set its tier to
"official", set provisional to false, and run npm run verify.
`;

await writeFile(target, body);
console.log(`Scaffolded src/content/events/${slug}.md`);
console.log('Six TODOs to fill. Verification stays "unknown" until you do.');
