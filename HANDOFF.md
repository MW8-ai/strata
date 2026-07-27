# Handoff

One-time kickoff brief. `CLAUDE.md` is the standing instruction file loaded every session;
this file is the state of play on 2026-07-26 and can be deleted once these tasks are done.

The two documents have different lifespans on purpose. That distinction is the subject of
this repository, so it would be embarrassing to get it wrong here.

## What is real and what is not

**Tested and working:**
- `scripts/verify.mjs` runs clean. Tested positively and negatively: injecting a broken
  lineage reference and an unsupported tier produced exit 1 with both failures named.
- All JSON parses. All three `.mjs` scripts pass `node --check`.
- Content is internally consistent: 9 methods, 5 events, 12 topics, 4 vendors, 0 failures,
  0 warnings.

**NOT tested, and the first thing to check:**
- `npm install` has never been run in this repo. Neither has `astro build`.
- The scenes have never rendered. The GSAP timeline logic in `src/scenes/registry.ts` is
  unexercised.
- No feed URL has been confirmed. All eight carry `"verified_url": false`.

## Task 1 — first build. Expect Astro content-layer drift.

`npm install && npm run build`.

The content collections API changed materially in Astro 5, and this repo was written without
running against an installed version. Likely breakages, in order of probability:

1. **Config location.** Astro 5 expects `src/content.config.ts`. This repo uses the legacy
   `src/content/config.ts`. Legacy mode may work with a warning, or may not.
2. **`type: 'content'` vs loaders.** Astro 5 prefers `loader: glob({ pattern: '**/*.md', base: './src/content/methods' })`.
3. **`entry.render()`.** May need to be the standalone `render(entry)` imported from `astro:content`.
4. **`entry.id`.** May or may not include the `.md` extension. The code calls
   `.replace(/\.md$/, '')` defensively, which is harmless either way, but `getStaticPaths`
   params and cross-references must agree.
5. **`getEntry(collection, id)` signature** and how `reference()` values resolve.

**Definition of done:** `npm run build` exits 0, every page renders, all three scenes step
through their five stages, and `npm run verify` still passes. Do not change any content
values to make the build pass. If a rule and the build disagree, the build is wrong.

## Task 2 — verify the feed sources

Eight adapters in `data/feed/sources.json`, all flagged `"verified_url": false`. For each:
fetch it, confirm it returns parseable RSS or Atom, then set the flag true. Where a URL is
dead, find the current one or delete the adapter. Do not leave a dead adapter in place; the
health alarm exists to catch rot, not to substitute for it.

Then run `npm run feeds` once and confirm `data/feed/latest.json` populates and the archive
snapshot writes.

**Definition of done:** every remaining source has `verified_url: true` and has returned at
least one item, or has been removed with a note in the commit message.

## Task 3 — fill the missing checks

12 of 21 caveats have no `check`. The register page surfaces this ratio deliberately.

Write the concrete test for each. Warnings and notes do not strictly require one, but the
security and permissioning ones should have it regardless of severity. The gate currently only
warns on critical caveats without a check; do not tighten that rule until the backlog is
cleared, or the build goes red on a known state.

**Definition of done:** every `critical` and every `security`- or `permissioning`-scoped caveat
has a `check` phrased as an action with a pass or fail outcome.

## Task 4 — things only a human can close

Do not attempt these. Surface them and stop.

- 6 of 9 methods are `review.status: unreviewed`. Only a person can change that.
- 3 method entries and 3 events rest on a machine-generated conference transcript at
  `reputable` tier. They need first-party sources before anything moves to `verified`.
  Candidates to search for: an Anthropic engineering post on Managed Agents memory, and one
  on the consolidation feature.
- `structured-memory-api` and both 2026 Anthropic events carry notes explaining exactly what
  is unconfirmed. Read those notes before touching those files.

## Task 5 — deploy

Repository settings, Pages source set to **GitHub Actions**. `astro.config.mjs` assumes a
project site at `/strata`; change `base` if the repo is renamed, or remove it for a root site.

The `pages.yml` workflow runs `npm run build`, which runs `verify` first, so a policy violation
cannot reach production. Leave that ordering alone.

## Current inventory

| | Count | Notes |
|---|---|---|
| Methods | 9 | 4 current, 4 additive, 1 superseded |
| Maturity | | 8 recommended, 1 preview |
| Events | 5 | 2 verified, 3 reported |
| Topics | 12 | 5 covered, 3 partial, 4 open gaps |
| Vendors | 4 | all have a `current_default` |
| Caveats | 21 | 9 critical, 7 warning, 5 note, 10 compliance gates |
| Human-reviewed methods | 3 of 9 | |
| Scenes | 3 | context-window, concurrency-cas, consolidation |

## Backlog, not urgent

- The core column is sticky on desktop and flips horizontal on mobile, where it loses its
  hover labels and becomes decoration. Make it tappable or hide it below 46rem.
- `--paper` and `--paper-raised` are close in value. If this gets presented on a projector,
  widen that gap.
- `docs/ANIMATION.md` notes that `src/scenes/registry.ts` is the only file importing GSAP,
  deliberately, so the dependency stays swappable. Keep it that way.
- The four open topic gaps are the roadmap. Do not write speculative methods to fill them.
