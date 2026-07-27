# Contributing

## The one rule

Write in your own words. Do not paste announcement text, and do not paraphrase a source
closely enough that the structure survives. If an entry reads like the press release it
came from, it fails review regardless of accuracy.

## Adding an event

1. `npm run promote "part of the feed item title"`, or copy an existing file in
   `src/content/events/`.
2. Fill in the six questions. `why` and `how` are the ones that take real work.
   - `why` names the limit of the previous approach that forced this.
   - `how` describes the mechanism specifically enough that someone could disagree with it.
3. Set `verification` honestly. Default to `unknown`. Leave `provisional: true` until
   somebody other than the author has read it.
4. `npm run verify`.

## Verification tiers

| Tier | Means | Examples |
|---|---|---|
| `official` | First-party. The organisation describing its own work. | vendor engineering blog, arXiv paper by the authors, official docs |
| `reputable` | Independent, edited, accountable. | established trade press, conference recording by the organiser |
| `community` | Useful, unverified. | blog posts, forum threads, machine transcripts |

`verification: verified` requires at least one `official` source. The build enforces this;
you cannot talk your way past it.

A machine-generated conference transcript is `community` or at best `reputable`, never
`official`, even when the speaker works for the vendor. Transcription errors are real and
the seed entries in this repo cite one that has several.

## Lineage edges

An edge is an argument, not a date, and gets the same scrutiny. Before adding one, be able
to answer: would the later work look different if the earlier work did not exist? If the
answer is no, it is chronology, not lineage, and the timeline already shows it.

## Vendor neutrality

- No scores, no rankings, no "leader" language.
- Vendor-reported numbers stay in prose with attribution, never in structured fields.
- Do not assert that anybody was first at anything without an official-tier source, and
  prefer "the earliest instance in this archive" over "the first".
- Absence of entries for a vendor is `unknown`, not evidence.

## Animations

See `docs/ANIMATION.md`. New scenes must be step-driven, keyboard reachable, and legible
with `prefers-reduced-motion` set. A scene that only makes sense in motion is a failed scene.
