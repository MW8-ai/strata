# Schema notes

`src/content.config.ts` is authoritative. `schemas/event.schema.json` is a published mirror
for tooling that should not have to run Astro.

## The six questions

| Field | Question | Note |
|---|---|---|
| `actors`, `vendor` | Who | People and institutions. `actors` is required, `vendor` is optional because papers often predate a product owner. |
| `title`, `what` | What | `what` is one sentence, mechanism first. |
| `date`, `date_precision` | When | Precision is explicit so the timeline never implies a day it does not have. |
| `where` | Where | The surface it appeared on: paper, api, product, conference, open-source, blog. |
| `why` | Why | The limit of the previous approach that forced this. The hardest field and the most valuable. |
| `how` | How | The mechanism, specific enough to argue with. |

## Why `primitive_class` is an enum and not free text

It drives the band colour in the core column. Colour is information here. Free text would
mean either an unbounded palette or a silent fallback, and a silent fallback in a governance
tool is a bug. Adding a class means adding a token in `src/styles/tokens.css`, which is the
point: it forces a design decision instead of allowing drift.

## Cross-field rules the schema enforces

- `verification: "verified"` requires an `official`-tier source.
- `verification: "reported"` requires at least one source.
- `date_precision: "day"` on a January 1 date is rejected as a probable padded year.
- `verified` and `provisional` cannot both be set.

## Rules the schema cannot see

Per-file validation cannot check references across files. `scripts/verify.mjs` covers:

- lineage edge targets resolve to real events
- primitive and vendor references resolve
- `retrieved_at` is not in the future
- source URLs are unique within an entry
- referenced scenes are registered

Both run in CI. Zod runs at build, `verify.mjs` runs before it.
