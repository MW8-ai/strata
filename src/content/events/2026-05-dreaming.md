---
date: "2026-05-06"
date_precision: "day"
actors: ["Anthropic"]
vendor: "anthropic"
title: "Dreaming enters research preview"
what: "An on-demand batch job that reviews past sessions alongside an existing memory store and produces a separate, reorganised memory store."
why: "In-band memory splits attention between task and curation, and cannot see patterns that only exist across sessions."
how: "The job takes 1 to 100 past sessions and a memory store as input and produces a new store: duplicates merged, contradicted entries replaced by the latest value, new patterns surfaced. The input store is never modified, so adopting the result means pointing future sessions at the new store, and discarding it means doing nothing."
where: "product"
method: "out-of-band-consolidation"
class: "consolidation"
verification: "verified"
review:
  status: "unreviewed"
  note: "First-party docs confirm the core mechanism, including that the input store is never modified: a dream always produces a separate output store, and using it is an explicit later step. That settles the question this site's consolidation scene depends on, whether the store updates itself, in the site's favour. The transcript's more granular claims, prevalence statistics, example transcripts surfaced for review, sub-agents fanning out across transcripts, are not stated in the official docs and have been dropped from 'how' rather than asserted as fact. They may still be true; the Console might show a diff view the API docs do not describe. That would need its own source."
sources:
  - url: "https://platform.claude.com/docs/en/managed-agents/dreams"
    title: "Dreams"
    tier: "official"
    publisher: "Anthropic"
    retrieved_at: "2026-07-28"
  - url: "https://tessl.io/registry/ainativedev/aidevcon-2026-ldn/0.100.13/files/talk-lamis-context-engineering-dreaming/transcript.md"
    title: "Context Engineering, Memory Systems, and Dreaming (AI Native DevCon 2026 London)"
    tier: "reputable"
    publisher: "Tessl / AI Native Dev"
    retrieved_at: "2026-07-26"
---

No quantitative benchmark was given. Any improvement figure needs its own source.
