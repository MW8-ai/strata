# Strata

A governed archive of how AI memory accumulated. Astro static site, deployed to GitHub Pages,
a component of the Cornerstone Method.

This file is loaded every session. It is deliberately short and stable. Anything task-specific
belongs in HANDOFF.md or an issue, not here.

## Commands

```bash
npm install
npm run dev       # localhost:4321/strata
npm run verify    # referential + policy gate. Run this before every commit.
npm run build     # verify, then astro build. Fails the build on a policy violation.
npm run feeds     # collect the feed lane
npm run promote "part of a feed item title"
```

## Shape

```
src/content/methods/   PRIMARY record. A method is an architectural pattern.
src/content/events/    dated evidence, each linked to a method.
src/content/topics/    the problem space, including gaps nobody has solved.
src/content/vendors/   vendor stance + the method each documents as default.
src/content.config.ts  Zod schemas. The contract. Read this before editing content.
src/scenes/            animated explainers, GSAP timelines over hand-authored SVG.
scripts/verify.mjs     cross-file gate. Checks what per-file Zod cannot see.
docs/STATUS-MODEL.md   the two-axis status model. Read before touching status fields.
docs/TOPIC-MAP.md      coverage rules for topics.
docs/SOURCE-POLICY.md  source tiers and verification.
```

## Hard rules

These are enforced by `npm run verify` and by the Zod schemas. Do not work around a failure by
relaxing a rule. If a rule fires, the data is wrong.

1. **Two status axes, never merged.** `maturity` is what the vendor says about readiness.
   `lifecycle` is whether you should still reach for it. They disagree constantly and that
   disagreement is the product.
2. **Tier describes the source. Verification describes the claim.** They are independent.
   An official-tier source can support a `reported` claim when the characterisation is the
   author's reading rather than the vendor's statement.
3. **Unknown is not none.** Never pad a date to make a timeline tidy. Never infer a status
   from silence.
4. **`evaluation.weak` and `evaluation.good` cannot be empty.** A method with no listed
   weakness has been advertised, not evaluated.
5. **No article text, ever.** Not from a feed item, not from a vendor post, not paraphrased
   closely enough that the original structure survives. The feed lane stores title, URL, date.
6. **A critical caveat needs a `check`:** the action that produces a pass or fail. "Attempt a
   write from a task agent identity and confirm the refusal" is a check. "Ensure permissions
   are correct" is not.

## What you must not decide on your own

- **Never set `verification: "verified"`** unless you have fetched a first-party source and it
  actually states the claim. Default to `reported` or `unknown`.
- **Never set `review.status: "reviewed"`.** Review means a human read it. An agent cannot
  certify that a human did something. Leave it `unreviewed` and say so in your summary.
- **Never invent a source, a date, or a URL.** If you cannot find one, the field stays
  `unknown` and the gap goes in your summary.
- **Never move a topic off `gap`** without a specific method that addresses it.
- **Never relax a rule in `scripts/verify.mjs` or `config.ts`** to make content pass. Fix
  the content. If a rule is genuinely wrong, raise it and stop.

## Writing style

- No em dashes. Use a comma, a colon, or a full stop.
- No marketing language, in any field. "Powerful", "seamless", "revolutionary" do not appear.
- `what` is one sentence, mechanism first.
- `why` names the limit of the previous approach that forced this.
- `how` is specific enough that a reader could disagree with it.
- Write in your own words. If a sentence could be lifted from the announcement, rewrite it.

## Conventions

- Every method needs at least one topic referencing it, or the topic map has a hole and
  verify warns.
- Adding a `METHOD_CLASS` means adding a band colour token in `src/styles/tokens.css`.
  Colour is data here, not decoration.
- Scenes are step-driven, never scroll-driven, and must be legible with
  `prefers-reduced-motion` set. See docs/ANIMATION.md.
