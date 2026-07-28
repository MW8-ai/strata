---
name: "Out-of-band consolidation"
class: "consolidation"
one_line: "A scheduled batch process, outside any task session, that reviews many transcripts at once and proposes curated changes to the memory store."
introduced: "2026"
maturity: "preview"
lifecycle: "additive"
superseded_by: []
used_with: ["in-band-memory-tools", "filesystem-as-memory", "tiered-permissioning"]
replaces: []
applies_to: ["anthropic", "multi-agent", "fleet", "human-in-loop", "managed-service"]
evaluation:
  good:
    - "Sees across sessions, which is the one thing no in-band process can do at any budget."
    - "Has its own token allocation, so curation stops competing with task completion."
    - "Output carries prevalence statistics and example transcripts, which makes the proposal reviewable rather than something to accept on faith."
    - "Catches tool misconfiguration, which is a large share of real agent failures and is invisible if you only read the text turns."
  weak:
    - "Slow feedback. A pattern found on Friday does not help the agent that hit it on Monday."
    - "Requires transcript retention, which is a data governance commitment before it is an engineering one."
    - "Quality depends on steering. Without a statement of what matters, it proposes changes that are statistically real and practically useless."
    - "Prevalence is not causation. Five sessions failing the same way can be five instances of one bad prompt rather than a missing memory."
  lacking:
    - "No published benchmark. Accuracy, cost, and latency improvements are stated as observations without numbers."
    - "No guidance on run frequency or on cost ceilings for the consolidation job itself."
    - "No comparison against existing eval loops, which address an overlapping problem from a different direction. The 'Measuring whether memory helped' topic raises the same unanswered comparison from the memory side."
  better_if:
    - "Proposals carried a confidence interval rather than a raw count."
    - "Rejected proposals fed back in, so the same rejected pattern was not re-proposed every cycle."
verification: "reported"
review:
  status: "unreviewed"
  note: "First-party docs now confirm the core mechanism this describes, including that a run never modifies its input store and always produces a separate output a person has to explicitly adopt. One evaluation claim remains sourced only to the conference transcript and is not confirmed by the official API docs, which describe a coarser whole-store accept-or-discard rather than a granular one: that the output carries prevalence statistics and example transcripts. That may still be true of the Console UI specifically, which the API docs do not cover, but it needs its own source before this moves past reported on that point."
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
caveats:
  - severity: "critical"
    scope: "permissioning"
    text: "This process reads across many sessions and writes to a shared store, so it is the most direct path for a permission violation in the whole architecture. Never let a run write to a tier above the transcripts it read."
    check: "For a sample run, compare the tier of every attached transcript against the tier of the store it wrote to. Any upward write is a finding."
    compliance_relevant: true
  - severity: "critical"
    scope: "data-retention"
    text: "Requires retaining session transcripts including tool calls and metadata. In a regulated environment that retention decision needs approval before the feature is enabled, not after."
    check: "Produce the written retention decision covering transcript storage, its duration, and its disposal path, dated before the feature was enabled. If it does not exist, the feature is running outside policy."
    compliance_relevant: true
  - severity: "warning"
    scope: "operability"
    text: "Never run this on auto-accept. Proposals are evidence for a human decision. An unattended consolidation loop drifts the store on statistically real coincidences."
    check: "Take the last consolidation run and match every change it made to the store against a named human's recorded acceptance. Any change without one reached the store unattended, whatever the configuration says."
    compliance_relevant: false
  - severity: "note"
    scope: "cost"
    text: "Budget the job explicitly. It has no natural ceiling: cost scales with transcript volume, which grows with adoption."
    check: "Read the token spend of the last three runs against the transcript count of each, and extrapolate to the transcript volume you expect at full adoption. Then confirm a ceiling exists in configuration and that a run which would exceed it stops rather than completing."
    compliance_relevant: false
scene: "consolidation"
order: 70
---

The school analogy carries this: markers review individual submissions, a head teacher reads
across the cohort and notices the whole class missed the same question. No individual marker
could see that, because no individual marker sees the cohort.

**Is it still used, or does it replace in-band memory?** Neither replaces the other, and this is
the most common misreading of the current architecture. In-band is fast and narrow; out-of-band
is slow and wide. They run in parallel and cover different failures. Marked `preview` because it
is a research preview, and `additive` because it joins the stack rather than displacing anything.
