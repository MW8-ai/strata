---
name: "In-band memory tools"
class: "file-as-memory"
one_line: "Tools that let an agent decide for itself, during a session, when to read, write, and update its own memory."
introduced: "2025"
maturity: "recommended"
lifecycle: "additive"
superseded_by: []
used_with: ["filesystem-as-memory", "out-of-band-consolidation"]
replaces: []
applies_to: ["llm-agnostic", "anthropic", "openai", "single-agent", "general-purpose"]
evaluation:
  good:
    - "Shortest possible feedback loop. A lesson written this session is available the next one."
    - "Curation authority moves from the harness to the model, which knows what mattered in the session and the harness does not."
    - "Requires no scheduling infrastructure. It is just tools."
  weak:
    - "Split attention. The agent is optimising task completion and memory curation from the same budget, and the task usually wins."
    - "Visibility stops at the session boundary. A mistake repeated across fifty sessions looks like a first occurrence in every one of them."
    - "Write quality is inconsistent because curation is a side task performed under time pressure."
  lacking:
    - "No deduplication. The same lesson gets written in slightly different words many times."
    - "No staleness detection. Nothing removes a memory that stopped being true."
  better_if:
    - "The write path carried a confidence signal so a low-confidence memory could be quarantined rather than trusted."
verification: "reported"
review:
  status: "unreviewed"
sources:
  - url: "https://tessl.io/registry/ainativedev/aidevcon-2026-ldn/0.100.13/files/talk-lamis-context-engineering-dreaming/transcript.md"
    title: "Context Engineering, Memory Systems, and Dreaming (AI Native DevCon 2026 London)"
    tier: "reputable"
    publisher: "Tessl / AI Native Dev"
    retrieved_at: "2026-07-26"
caveats:
  - severity: "critical"
    scope: "permissioning"
    text: "An agent that hits a problem and decides to record a fix in the shared file propagates a possibly wrong conclusion to every other agent reading it. Organisation-wide context should be read-only to task agents; writes belong to a reviewed path."
    check: "Give an agent a task that will plausibly tempt it to record an organisation-wide lesson. Confirm the write lands in its own scratchpad and nowhere else."
    compliance_relevant: true
  - severity: "critical"
    scope: "security"
    text: "The write path is a prompt injection target. Content read during a task can instruct the agent to write attacker-chosen text into memory, which then persists into every future session that reads it."
    check: "Place a benign marker instruction in a document the agent will read, telling it to record a specific phrase. Run the task and grep the store for the phrase."
    compliance_relevant: true
  - severity: "warning"
    scope: "concurrency"
    text: "Without compare-and-swap on the write, two agents editing the same file lose one of the updates with no error raised. See the concurrency control method."
    check: "Run two agents against one memory file with edits to different sections, timed to overlap. Read the file afterwards and confirm both edits survived. If one is missing, confirm its agent was told the write was refused rather than being reported as successful."
    compliance_relevant: false
  - severity: "note"
    scope: "data-retention"
    text: "Memory written autonomously is memory nobody chose to retain. Establish what may be written before enabling this anywhere with personal or regulated data."
    check: "Produce the written statement of what agents may and may not record, dated before the tools were enabled, then sample a week of writes against it. Any category present in the store that the statement does not permit is a finding, and an absent statement means the feature is running outside policy."
    compliance_relevant: true
order: 20
---

The important shift here is authority. In retrieval the harness decides what enters context.
Here the model decides. Everything after this inherits that handoff, and every guardrail
after this exists to bound it.

**Is it still used?** Yes, and it is not replaced by out-of-band consolidation. The two run in
parallel and cover different weaknesses: in-band is fast and narrow, out-of-band is slow and
wide. Treating consolidation as a replacement is the most common misreading of the current
architecture.
