---
name: "Instruction file injection"
class: "context-window"
one_line: "A single markdown file of project conventions and preferences, loaded into context at the start of every session."
introduced: "2025"
maturity: "recommended"
lifecycle: "additive"
superseded_by: []
used_with: ["progressive-disclosure", "filesystem-as-memory"]
replaces: []
applies_to: ["llm-agnostic", "anthropic", "single-agent", "coding", "human-in-loop"]
evaluation:
  good:
    - "Effort to value ratio is the best of anything in this archive. One file, no infrastructure, immediate improvement in how well the agent navigates a codebase."
    - "Human readable and human writable. The person and the agent edit the same artifact, so there is no translation layer to drift."
    - "Diffable in git, so conventions get reviewed like code."
  weak:
    - "Loaded unconditionally. Every token is spent on every request whether or not the session needs it."
    - "Grows without bound. Nobody deletes from it, so it accumulates until the important lines are diluted among the stale ones."
    - "No relevance signal. A rule about database migrations is loaded during a CSS task."
  lacking:
    - "No versioning or provenance. Who added the rule, and which incident prompted it, is not recorded."
    - "No conflict resolution when two contributors add contradictory conventions."
  better_if:
    - "It carried a per-section relevance hint so the harness could load selectively."
    - "Stale-rule detection flagged lines that no session has needed in months."
verification: "verified"
review:
  status: "reviewed"
  date: "2026-07-26"
  note: "Behaviour confirmed against first-party documentation. Evaluation is the author's judgement, not vendor claims."
sources:
  - url: "https://docs.claude.com/en/docs/claude-code/memory"
    title: "Claude Code memory and CLAUDE.md"
    tier: "official"
    publisher: "Anthropic"
    retrieved_at: "2026-07-26"
caveats:
  - severity: "warning"
    scope: "cost"
    text: "Cost scales with file size times session count. A 4,000-token instruction file across a thousand daily sessions is a real line item, and it is invisible because it never appears as a user message."
    compliance_relevant: false
  - severity: "note"
    scope: "operability"
    text: "Treat this file as a shared codebase artifact, not personal config. If it lives outside version control it will diverge per machine and per contributor within weeks."
    compliance_relevant: false
  - severity: "warning"
    scope: "security"
    text: "Anything in this file reaches the model on every request. Never place credentials, internal hostnames, or restricted identifiers here. In a regulated environment treat it as data that leaves your boundary."
    compliance_relevant: true
scene: "context-window"
order: 10
---

Still correct, still shipped, still the first thing to do on a new project. It is `additive`
rather than `superseded` because nothing replaced its job. Later methods relieved it of jobs
it was never good at.

The failure worth teaching is dilution rather than overflow. Teams assume the file is fine
until it hits some limit. It is degrading long before that, because a rule that occupies one
line in four thousand tokens is competing for attention with everything else in the window.

**Is it still used?** Yes, universally, and it should be. The correct posture is to keep it
small and stable, and push anything conditional into progressive disclosure.
