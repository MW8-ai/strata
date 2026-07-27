# Strata

A governed archive of how AI memory accumulated, and a teaching aid for the primitives
that make it work.

A component of the **Cornerstone Method**. Live at `https://MW8-ai.github.io/strata`.

---

## What this is

A record of **methods**, not vendor announcements. `CLAUDE.md` injection is a method.
Filesystem-as-memory is a method. Dated events are evidence for methods, not the primary
record.

The question every entry has to answer is the one you have after six months away: is this
still how it is done, is it still used alongside the new thing, or did something replace it
outright.

That needs two independent status axes, because vendors and the field routinely disagree:

- **Maturity** — what the vendor says about readiness: `prototype`, `development`, `preview`, `recommended`.
- **Lifecycle** — whether you should still reach for it: `current`, `additive`, `superseded`, `withdrawn`.

Instruction file injection is `recommended` and `additive`. Shipped, supported, correct, no
longer the whole answer. Out-of-band consolidation is `preview` and `additive`. One field
cannot say either. See `docs/STATUS-MODEL.md`.

Every method also carries an honest four-part evaluation — what is good, where it is weak,
what is missing, what would make it better — and `evaluation.weak` cannot be empty. A method
with no listed weakness has been advertised, not evaluated. The build enforces this.

## Caveats are the point

Each method carries operational notes an engineer needs before adopting it, graded
`critical` / `warning` / `note` and scoped to permissioning, concurrency, security, cost,
latency, data retention, portability, or operability. Anything marked `compliance_relevant`
renders with a visible gate tag.

They are written to be verifiable by action. For example, on tiered permissioning:

> Verify by attempting a write, not by reading the configuration. A task agent should be
> unable to modify organisation-wide context, and the only way to know is to try it and see
> the refusal.

## The topic map covers what nobody has solved

`/topics` lists the questions underneath the methods, each marked `covered`, `partial`, or
`gap`. Four are currently open gaps with no method addressing them: forgetting and eviction,
contradictory memories, measuring whether memory helped, and cost attribution.

This is what makes the site useful over a year rather than a day. Covered topics barely move.
A gap moving to `partial` means somebody solved something, and that is the most informative
change the site can record. The build rejects a `gap` that lists methods, and rejects one with
no open questions.

## The caveat register is the whole risk surface on one page

`/register` aggregates every caveat across every method, grouped by scope, filterable to
critical only, compliance gates only, or the ones still missing a concrete check.

Critical caveats carry a `check`: the action that produces a pass or fail, not the intention.
"Attempt a write from a task agent identity and confirm the refusal appears in the audit log"
is a check. "Ensure permissions are configured correctly" is not. The gate warns on any
critical caveat without one.

## The landing page is a state-of-the-practice digest

Not a news feed. Someone returning after six months lands on four buckets — reach for these
first, still correct but no longer the whole answer, not ready yet, superseded — plus where
each vendor currently sits. No scores, no rankings.

## Two lanes, hard-separated

This is the part most trackers get wrong, so it is enforced by the build rather than by
discipline.

| | Canonical lane | Feed lane |
|---|---|---|
| Path | `src/content/events/` | `data/feed/` |
| Written by | a person, via pull request | `scripts/fetch_feeds.mjs`, on a schedule |
| Rendered as | claims, with sources shown | unverified items, labelled everywhere |
| Contains | your own words | titles, links, dates only |
| Promotion | `scripts/promote.mjs` scaffolds a stub with six TODOs | — |

No article text is ever copied into this repository. The feed lane stores a title, a URL,
and a date. Everything a reader sees in the archive was written by a person who read the
source.

The governing rule, inherited from the rest of the suite: **raw exports are evidence, AI
summaries are suggestions, canonical state is human-approved truth.**

## Verification is visible, not buried

Colour encodes the class of primitive. Fill encodes how well the claim is sourced.

- **Solid** — verified. At least one official-tier first-party source. Enforced by the build.
- **Hatched** — reported. Secondary sources only.
- **Dotted outline** — unknown.

**Unknown is not none.** An entry with no confirmed date is marked unknown and rendered as
an open outline. It is never rounded to a plausible year to make the column look tidier.

## Seed data status

The five seed events ship with honest verification tiers, and three are marked
`provisional: true`. That is deliberate: it demonstrates the schema under realistic
conditions rather than pretending every claim is settled. Before publishing, replace the
secondary sources with first-party ones and clear the provisional flags. `npm run verify`
will tell you which.

## Running it

```bash
nvm use          # Node 22.12+, the floor Astro 7 enforces
npm install
npm run dev      # http://localhost:4321/strata

npm run verify   # referential + policy gate
npm run feeds    # collect the feed lane locally
npm run promote "part of a feed item title"
npm run build    # verify, then build. Broken references never reach Pages.
```

## Layout

```
src/content/methods/  primary record. Zod schemas in config.ts are the contract.
src/content/events/   dated evidence, linked from methods.
src/scenes/      animated explainers. One module per scene, GSAP timelines.
src/pages/       state, methods, evidence, feed, vendor profiles.
data/feed/       feed lane plus per-source health state.
scripts/         fetch, verify, promote.
schemas/         published JSON Schema mirror for external tooling.
docs/            status model, topic map, source policy, schema, animation contract.
```

## Deploying

Set Pages to **GitHub Actions** in repository settings. `astro.config.mjs` assumes a project
site at `/strata`; change `base` if you rename the repo, or remove it for a root site.

## Contributing

Corrections are welcome, especially to dates and attributions. See `CONTRIBUTING.md`. The
fastest useful contribution is promoting an entry from reported to verified by finding the
first-party source.

MIT licensed.
