# Handoff

One-time kickoff brief. `CLAUDE.md` is the standing instruction file loaded every session;
this file is the state of play and can be deleted once these tasks are done.

The two documents have different lifespans on purpose. That distinction is the subject of
this repository, so it would be embarrassing to get it wrong here.

**State of play: 2026-07-28.** Tasks 1, 2, 3 and 5 are closed. Task 4's sourcing is closed;
the six `review.status: unreviewed` flags across methods and events are the only remaining
work, and only a person can close them.

## Task 1 — first build. CLOSED.

`npm install && npm run build` exits 0 and builds 19 pages. Three things broke.

1. **Config location and loader API.** Both, and they were the same fix. The repo used the
   legacy `src/content/config.ts` with `type: 'content'`. Legacy mode strips `slug` out of
   the frontmatter before the schema sees it, and `vendors` carries a real `slug` field that
   the vendor routes are built from, so the build died on `vendors/anthropic`. Now
   `src/content.config.ts`, every collection on a `glob()` loader.
2. **`entry.render()`** is no longer a method on an entry. Now the standalone `render(entry)`.
3. **`entry.id`** does not include the extension under the glob loader. It is the filename
   without it, which is what every `reference()` value was already written against. The
   defensive `.replace(/\.md$/, '')` calls are harmless and were left alone.

No content value changed. `npm run verify` still passes.

Two things were wrong that only showed up once the scenes actually rendered:

- **Scenes did not scrub backwards.** Steps set their label text from GSAP `.call()`
  callbacks, which run on the forward pass only. Stepping back or replaying left a later
  step's text on screen under an earlier step's caption: after Replay the caption read
  "hash a1f3" while the diagram showed `b7c2` and step 5's verdict. Label text is now
  declared per step in a `text` map and applied from the step index. `docs/ANIMATION.md`
  already named reverse scrubbing as a reason GSAP was chosen; that is now true, and rule 6
  in that file records it.
- **Method relation lists had no separator**, rendering three links as one run-on word.
  `topics.astro` already did this correctly and was copied.

Verified in Chromium, not just built: all 19 pages render, every internal link resolves to a
built page, all three scenes step through five stages forward and back, Replay restores the
opening state exactly, and every end state is reachable under `prefers-reduced-motion`.
The only console error anywhere is the Google Fonts stylesheet, which the sandbox this ran
in cannot reach. Confirm it loads once deployed.

## Task 2 — verify the feed sources. CLOSED.

Settled by the first real `feeds` workflow run on 2026-07-27, on an unrestricted network,
rather than by hand from a sandbox that could not reach seven of the eight hosts.

**Six adapters are alive and are now `verified_url: true`**, each having returned at least one
item: `openai-news` 58, `arxiv-memory` 37, `deepmind-blog` 7, `microsoft-research` 2,
`google-ai-blog` 1, `azure-ai-blog` 1. 106 items are held in `data/feed/latest.json`.

**Both Anthropic adapters were dead and have been removed.** They answered HTTP 404 from the
origin, twice, which is real evidence rather than the proxy 403s seen earlier. Anthropic
publishes no official RSS feed for its news page or its engineering blog, so there is no
current URL to swap in.

**That leaves a real hole: there is no Anthropic feed**, and Anthropic is the vendor most of
this archive's 2026 content concerns. It is deliberate. The only feeds that exist are
unofficial community mirrors that scrape the site, and adopting one would put items into the
feed lane whose titles, links and dates come from a third-party scraper rather than the
vendor. That is a provenance decision for a person, not a URL fix, and this repository is
strict about provenance. If Anthropic ships an official feed, add it back as `anthropic-news`
with `verified_url: false` and let the workflow prove it. Recorded in
`data/feed/sources.json` under `$anthropic_gap`.

`vendors/anthropic.md` had `feed_ids: ["anthropic-news", "anthropic-engineering"]` pointing at
the removed adapters and is now `[]`, so no dangling references remain. The two stale entries
were also pruned from the `health` block, which otherwise keeps reporting on sources that no
longer exist.

**Note on how the run reached this branch.** The `feeds` workflow checks out the repository
default branch, and the default is still `claude/handoff-documentation-review-9x1zsp` rather
than `main`, so the bot committed onto an open pull request branch. Setting the default to
`main` fixes that. It also explains why that commit carries no CI run: pushes made with
`GITHUB_TOKEN` deliberately do not trigger further workflows.

## Task 3 — fill the missing checks. CLOSED.

24 of 24 caveats now carry a check. The counts in the original brief were stale: there were
24 caveats and 15 without a check, not 21 and 12, and all 9 critical ones already had one.
The definition of done covered 3 of the 15. All 15 were written, because the register page
exists to show that ratio and a partial fill leaves it reading as a backlog.

**The gate is now closed, as this brief allowed once the backlog cleared.** A critical caveat
with no check now fails the build rather than warning, matching hard rule 6 in `CLAUDE.md`.
Security- and permissioning-scoped caveats below critical severity warn. Tested both ways.

## Task 4 — sourcing is closed; review status is still open, and only a human can close it.

2026-07-28: `platform.claude.com` turned out to be reachable from this environment even though
`anthropic.com` and `claude.com/blog` are not, so three first-party Anthropic docs pages got
fetched and read: `/docs/en/managed-agents/memory`, `/docs/en/managed-agents/dreams`, and
`/docs/en/managed-agents/tools`. Every method and event that rested on the conference
transcript has been re-checked against them. What follows is what changed and what did not.

**Upgraded to `verified` with an official source, because the docs state the claim
directly:**
- `hash-compare-and-swap` — the Memory Stores API takes a `content_sha256` precondition on
  update, read before the edit and checked again at write time, refused on mismatch. That is
  this method exactly.
- `2026-04-managed-agents-memory` — memory versions are an immutable audit trail on every
  write, and a store is workspace-scoped and attachable to multiple sessions. "Public" was
  dropped from `what`; the docs do not say public versus gated, only that dreaming
  specifically gates behind a research-preview waitlist and memory does not, which is
  suggestive but not a confirmed absence of a gate.
- `2026-05-dreaming` — **this resolves the conflict this file used to flag.** The docs state
  outright that a dream's input store is never modified; it always produces a separate output
  store, and adopting it means explicitly pointing future sessions at the new one. The
  consolidation scene's caption, "The store never updates itself," is correct. `what` and
  `how` were rewritten to match the confirmed mechanism, dropping the transcript's more
  granular claims (sub-agents fanning out, prevalence statistics) that the official docs do
  not state. Those details are not contradicted, just unconfirmed; they may still be exactly
  right and just live in the Console rather than the API docs.

**Given an official source but left at `reported`, because the claim is this repository's
reading rather than the vendor's own words:**
- `filesystem-as-memory` — the file-mount mechanism is confirmed; "markdown" is this
  archive's read of the docs' own example convention (every example path ends `.md`), not a
  stated requirement.
- `in-band-memory-tools` — the docs confirm autonomous tool use generally and file-tool-based
  memory access specifically; framing memory maintenance itself as an agent decision is this
  archive's synthesis of the two.
- `tiered-permissioning` — the docs confirm a binary `read_only` / `read_write` primitive per
  store attachment; the three-tier scheme and the write-through-review gate on the team tier
  are this repository's recommended architecture on top of that primitive, not a shipped
  feature.
- `out-of-band-consolidation` — the core mechanism is now confirmed (see `2026-05-dreaming`
  above). One evaluation claim, that output carries prevalence statistics and example
  transcripts for review, is not stated in the API docs, which describe a coarser
  whole-store accept-or-discard. It needs its own source before it can move past `reported`.

Each file's `review.note` says precisely which part is confirmed and which part is this
repository's characterisation, so the next reviewer does not have to re-derive it.

**Still open, and still yours.** `review.status` is `unreviewed` on all six methods it was
unreviewed on before, `filesystem-as-memory`, `hash-compare-and-swap`,
`in-band-memory-tools`, `out-of-band-consolidation`, `structured-memory-api`,
`tiered-permissioning`, and on both 2026 Anthropic events. None of the sourcing work above
touched that field, on purpose: `review.status: "reviewed"` is a claim that a person read the
entry, and fetching a source and reading it is not that. `structured-memory-api` was not
touched at all, since nothing above concerned it; its existing `review.note` still applies.

Two candidate URLs from the original brief were never reachable and remain unconfirmed:
`https://claude.com/blog/claude-managed-agents-memory` and
`https://www.anthropic.com/engineering/managed-agents`. Both returned 403 from this
environment. If either turns out to add something the docs pages above do not already state,
it is worth a look; otherwise the docs pages cover the same ground more precisely.

## Task 5 — deploy. CLOSED, except for one setting only an admin can change.

**Set Pages source to GitHub Actions** in repository settings. Nothing else is outstanding.

`pages.yml` runs `npm run build`, which runs `verify` first, so a policy violation cannot
reach production. That ordering is unchanged.

**`npm ci` would have failed on the first push.** Both workflows run it and it requires a
committed `package-lock.json`, which did not exist because `npm install` had never been run.
The lockfile is now committed. Simulated from a clean clone: `npm ci` then `npm run build`
both succeed.

`astro.config.mjs` still assumes a project site at `/strata`. Change `base` if the repo is
renamed, or remove it for a root site.

**Dependencies are on latest and `npm audit` is clean, 0 vulnerabilities.** Astro is on 7.1.3
and GSAP on 3.15.0. The 3 advisories that were open against Astro 5 (`astro`, `esbuild`,
`sharp`) are gone rather than accepted.

The upgrade needed no source changes. The content-layer migration in task 1 had already moved
this repo onto the loader API and standalone `render()`, which is what Astro 7 expects, so the
two majors cost one line of config: **Astro 7 requires Node `>=22.12.0`** and `.nvmrc` pinned
`20.11`. Both workflows read `node-version-file: '.nvmrc'`, so that pin, not the code, is what
failed Dependabot's attempt at this upgrade with `Node.js v20.11.1 is not supported by Astro!`.
`.nvmrc` is now `22.12.0` and `engines.node` matches. **Anyone with a local clone needs to
`nvm use` again**, or the build will refuse to run.

## Current inventory

Counts verified 2026-07-27 against the content, not carried over.

| | Count | Notes |
|---|---|---|
| Methods | 9 | 4 current, 4 additive, 1 superseded |
| Maturity | | 8 recommended, 1 preview |
| Events | 5 | 4 verified, 1 reported |
| Topics | 12 | 5 covered, 3 partial, 4 open gaps |
| Vendors | 4 | all have a `current_default` |
| Caveats | 24 | 9 critical, 9 warning, 6 note, 13 compliance gates |
| Caveats with a check | 24 of 24 | |
| Human-reviewed methods | 3 of 9 | |
| Feed sources verified | 6 of 6 | two dead Anthropic adapters removed, no vendor feed for Anthropic |
| Feed items held | 106 | first real collection, 2026-07-27 |
| Scenes | 3 | context-window, concurrency-cas, consolidation |

## Backlog

**The core column does not render anywhere. It is dead code.** This is the one finding worth
acting on. `src/components/CoreColumn.astro` is imported by no page, and no `.core*` class
appears in any of the 19 built pages. The 8 `core__` rules in `src/styles/global.css` ship as
dead CSS, `docs/SCHEMA.md` describes band colour "in the core column" as if it were live, and
the backlog entry below was written as though it were on screen. `CLAUDE.md` calls it the
signature element and it is the hero of the visual preview, so this reads as never wired up
rather than deliberately cut, which is consistent with the build never having been run.

The old entry read: "The core column is sticky on desktop and flips horizontal on mobile,
where it loses its hover labels and becomes decoration. Make it tappable or hide it below
46rem." That describes behaviour nothing currently exhibits. Fixing its mobile CSS is
pointless until it is mounted, and mounting the signature element on the landing page is a
design decision rather than a bug fix, so it is left for a person. If it is mounted, the
mobile label does need solving: the bands are already `<a>` elements so they are tappable, but
the `::after` label is positioned to the right of the band with `white-space: nowrap`, which
on a narrow horizontal strip renders off screen.

**Surface contrast is done.** `--paper` to `--paper-raised` went from 1.10:1 to 1.22:1, and
the ladder spans 1.44:1. `--rule-hair` and `--ink-soft` moved with it so the change did not
weaken card edges or push the badge key below AA. See the comments in `src/styles/tokens.css`
for the numbers and the constraint on darkening `--paper` further.

**18 text styles sit below the 4.5:1 WCAG AA threshold**, measured against the rendered DOM
across five pages. None were introduced by the contrast work and none are fixed. Three
sources:

- `--ink-faint` at 2.45:1 on paper, used for `meta`, `cov`, `mcard__note`, `caveat__src`.
  Neutral, and "faint" is clearly the intent, so darkening it is a legibility against tone
  trade. About `#6f7a80` would clear AA.
- The warning gold `#b8862b` at 2.60:1 and the current-lifecycle green `#2e7d6f` at 3.94:1,
  as text in `eyebrow` and `cov`.
- White `badge__v` text on those same two colours as backgrounds, 3.00:1 and 3.18:1.

The last two are the awkward ones: those colours encode `maturity`, `lifecycle` and severity,
and `CLAUDE.md` is explicit that colour is data here, not decoration. Changing them changes
the encoding, and the band tokens are shared with the scenes. The fix is probably to stop
using a data colour as text colour rather than to re-pick the palette, but that is a
maintainer's call.

- `docs/ANIMATION.md` notes that `src/scenes/registry.ts` is the only file importing GSAP,
  deliberately, so the dependency stays swappable. Still true. Keep it that way.
- The four open topic gaps are the roadmap. Do not write speculative methods to fill them.
