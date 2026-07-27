---
name: "Tiered memory permissioning"
class: "permissioning"
one_line: "Scope memory by blast radius: organisation-wide context read-only, team context write-through-review, per-agent scratchpad read-write."
introduced: "2026"
maturity: "recommended"
lifecycle: "current"
superseded_by: []
used_with: ["filesystem-as-memory", "hash-compare-and-swap", "out-of-band-consolidation"]
replaces: []
applies_to: ["llm-agnostic", "multi-agent", "fleet", "human-in-loop", "self-hosted", "managed-service"]
evaluation:
  good:
    - "Bounds blast radius. One agent's wrong conclusion cannot reach every other agent without passing a review gate."
    - "Maps cleanly onto least privilege, so it maps onto controls a security team already recognises."
    - "Makes the shared tier deliberately expensive to change, which is correct: shared context should move slowly."
  weak:
    - "Somebody has to define the tiers, and getting them wrong in the permissive direction produces no visible symptom until something has already propagated."
    - "Review of the shared tier becomes a bottleneck, and a bottleneck under pressure gets bypassed."
    - "Tier boundaries drift as teams reorganise, and nothing forces a re-examination."
  lacking:
    - "No standard audit query. Answering which agent changed shared context last month should be one command and usually is not."
    - "No expiry on elevated access granted for one incident."
  better_if:
    - "Write attempts that were refused were logged as loudly as writes that succeeded. A refused write is a signal about a misconfigured agent."
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
    text: "Configuration that looks correct and is not enforced is the common failure mode. Reading the config proves intent, not enforcement."
    check: "From a task agent identity, attempt a write to an organisation-wide memory file. It must be refused and the refusal must appear in the audit log. Repeat after every permission change and after any workspace reorganisation."
    compliance_relevant: true
  - severity: "critical"
    scope: "security"
    text: "Permission tiers must survive the out-of-band path too. A consolidation job reading transcripts across teams can launder a low-tier observation into high-tier shared context."
    check: "List the transcripts attached to a consolidation run and confirm every one of them originates at or above the tier of the store the run may write to."
    compliance_relevant: true
  - severity: "warning"
    scope: "operability"
    text: "Per-write audit records need to capture which agent, which session, which transcript, and which human approved. Anything less will not answer an incident question."
    check: "Pick one line already sitting in the shared store and, from the audit records alone, name the agent that wrote it, the session it came from, the transcript that prompted it, and the human who approved it. Any of the four you cannot recover is the one the incident will turn on."
    compliance_relevant: true
order: 60
---

The tier model is the single most important thing on this site for anyone deploying inside a
compliance boundary. It is also the one most often configured once and never tested.

**Is it still used?** Current and foundational. Nothing supersedes least privilege; the open
work is enforcement and audit quality, not the model.
