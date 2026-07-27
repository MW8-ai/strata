# Handoff

One-time kickoff brief. `CLAUDE.md` is the standing instruction file loaded every session;
this file is the state of play and can be deleted once these tasks are done.

The two documents have different lifespans on purpose. That distinction is the subject of
this repository, so it would be embarrassing to get it wrong here.

**State of play: 2026-07-27.** Tasks 1, 3 and 5 are closed. Task 2 is closed as far as an
agent can close it. Task 4 is open and is the only remaining work, and it needs a person.

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

## Task 2 — verify the feed sources. CLOSED as far as an agent can close it.

`microsoft-research` is confirmed: HTTP 200, `application/rss+xml`, 10 items parsed by the
repo's own `parseItems`, 2 matching the keyword list. `verified_url` is now true.

**The other seven are unconfirmed, and their `verified_url: false` does not mean they are
dead.** The environment this ran in routes outbound HTTPS through an egress allowlist that
answered 403 to the CONNECT for every host except `www.microsoft.com`. A 403 from that proxy
says nothing about the feed. Deleting an adapter on that evidence would have been worse than
leaving it unverified, and marking it true would have been inventing a verification. The
reason is recorded in `data/feed/sources.json` under `$verification_status`.

**To finish this:** re-run the seven from an unrestricted network, or just read the `health`
block in `data/feed/latest.json` after the first real `feeds` workflow run, which has open
egress. Then set the flags and delete anything genuinely dead.

`npm run feeds` was run once and works end to end: it fetched, degraded gracefully on each
blocked source, wrote `latest.json` with the collected items and a full health block, and
wrote the monthly archive snapshot. **That output was deliberately not committed.** Its
health block recorded seven sandbox 403s as feed rot, and the alarm exists to catch real rot.

## Task 3 — fill the missing checks. CLOSED.

24 of 24 caveats now carry a check. The counts in the original brief were stale: there were
24 caveats and 15 without a check, not 21 and 12, and all 9 critical ones already had one.
The definition of done covered 3 of the 15. All 15 were written, because the register page
exists to show that ratio and a partial fill leaves it reading as a backlog.

**The gate is now closed, as this brief allowed once the backlog cleared.** A critical caveat
with no check now fails the build rather than warning, matching hard rule 6 in `CLAUDE.md`.
Security- and permissioning-scoped caveats below critical severity warn. Tested both ways.

## Task 4 — things only a human can close. OPEN. The remaining work.

Do not let an agent close these. The counts below are corrected; the original brief
undercounted the transcript dependency.

**Six of nine methods are `review.status: unreviewed`.** Only a person can change that:
`filesystem-as-memory`, `hash-compare-and-swap`, `in-band-memory-tools`,
`out-of-band-consolidation`, `structured-memory-api`, `tiered-permissioning`.

**Five methods and one event rest on the same machine-generated conference transcript** at
`reputable` tier, not three and three. The methods are `filesystem-as-memory`,
`hash-compare-and-swap`, `in-band-memory-tools`, `out-of-band-consolidation` and
`tiered-permissioning`; the event is `2026-05-dreaming`. One transcript is carrying most of
the archive's 2026 content, and it is the single point of failure here.

`2026-04-managed-agents-memory` is separate: it rests on a `reputable` third-party blog, not
the transcript, and also needs a first-party source.

**Candidate first-party sources, found by search but NOT fetched and NOT confirmed.** The
network in this environment could not reach them, so nothing was promoted on their basis.
Read them before using them, and remember that tier describes the source while verification
describes the claim:

- `https://claude.com/blog/claude-managed-agents-memory` for the Managed Agents memory event
- `https://www.anthropic.com/engineering/managed-agents` for the same
- `https://platform.claude.com/docs/en/managed-agents/dreams` for the consolidation feature
- `https://claude.com/blog/new-in-claude-managed-agents` for the same

**One possible factual conflict, worth checking first.** Search snippets for the dreaming
documentation suggest the vendor supports letting the process update memory automatically,
with human review as an option rather than a requirement. The consolidation scene's closing
caption asserts "The store never updates itself." That may be an operational recommendation
stated as a mechanism. Read the source and decide; do not edit the caption on the strength
of a search snippet, which is all the evidence there is right now.

`structured-memory-api` and both 2026 Anthropic events carry `review.note` fields explaining
exactly what is unconfirmed. Read those notes before touching those files.

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
| Events | 5 | 2 verified, 3 reported |
| Topics | 12 | 5 covered, 3 partial, 4 open gaps |
| Vendors | 4 | all have a `current_default` |
| Caveats | 24 | 9 critical, 9 warning, 6 note, 13 compliance gates |
| Caveats with a check | 24 of 24 | |
| Human-reviewed methods | 3 of 9 | |
| Feed sources verified | 1 of 8 | seven unreachable from here, not dead |
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
