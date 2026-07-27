# Suite membership

Strata is a component of the Cornerstone Method.

## What it inherits

| Inherited from | What carries over |
|---|---|
| CloudIntelMatrix | Three-tier source policy. `Unknown` is not `None`, enforced in data and in the UI. A verification script that gates the build. Weekly refresh cadence. |
| Plumbline | Deterministic gates before any judgement-based review. `npm run verify` is the deterministic tier. |
| Architecture Anatomy | Static Pages deployment, JSON and markdown as the source of record, SVG-first visualisation so diagrams stay diffable in git. |

## What is different, and why it is a separate component

CloudIntelMatrix answers *what capability exists where, right now*. Its shape is a matrix,
entity by capability, and it exists to support a decision at a boundary.

Strata answers *how did this get here and why*. Its shape is a timeline plus a directed
lineage graph. It exists to make a field legible to someone learning it.

The overlap is the governance machinery, not the subject or the output. Reusing the machinery
and forking the shape is the right split. Reimplementing the source policy would have been the
wrong one.

## Boundaries

- Strata does not make capability recommendations. If a reader needs to choose a platform,
  that is CloudIntelMatrix's job.
- Strata does not host architecture diagrams of a user's own system. That is Architecture
  Anatomy's job. Scenes here explain published primitives, not customer topologies.
- Strata asserts no ranking of vendors. Vendor profiles carry a stance, sourced and
  attributed, never a score.

## Open cross-links

- The scene engine in `src/scenes/` and Architecture Anatomy's visualisation layer solve
  adjacent problems. If a shared SVG scene primitive emerges, it belongs in neither repo and
  should be extracted.
- `schemas/event.schema.json` is published so the suite hub can index Strata entries without
  running Astro.
