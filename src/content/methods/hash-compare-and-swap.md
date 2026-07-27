---
name: "Hash compare-and-swap on memory writes"
class: "concurrency-control"
one_line: "Hash the memory file before drafting an edit, hash again before committing, and refuse the write if the two differ."
introduced: "2026"
maturity: "recommended"
lifecycle: "current"
superseded_by: []
used_with: ["filesystem-as-memory", "tiered-permissioning"]
replaces: []
applies_to: ["llm-agnostic", "multi-agent", "fleet", "self-hosted", "managed-service"]
evaluation:
  good:
    - "Solves the lost update problem without locking, so no agent blocks another and there is no lock to leak on a crashed session."
    - "Borrowed wholesale from settled software engineering rather than invented, so the failure modes are already understood."
    - "Cheap. A hash comparison is nothing next to the inference cost of the write it guards."
  weak:
    - "Only detects conflicts, it does not merge them. The losing agent has to re-read and re-draft, which costs a full round trip."
    - "Under heavy contention on one file, retries can dominate. The pattern degrades exactly where write volume is highest."
    - "File-level granularity means two edits to unrelated sections of the same file still collide."
  lacking:
    - "No back-off guidance, so a naive implementation can livelock two agents retrying against each other."
    - "No semantic merge, which is plausible for markdown and would eliminate most retries."
  better_if:
    - "Granularity were per-section rather than per-file."
    - "Retry carried the diff that caused the conflict, so the re-draft could account for it instead of starting over."
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
    scope: "concurrency"
    text: "Without this, concurrent writes to a shared memory file lose updates silently. There is no error, no log line, and no way to detect it after the fact."
    check: "Drive two agents at the same memory file concurrently, then diff the result against both intended edits. Both must be present or one must have been explicitly refused and retried."
    compliance_relevant: false
  - severity: "warning"
    scope: "operability"
    text: "Cap the retry count and log exhaustion. An agent silently giving up on a memory write is indistinguishable from an agent that had nothing to write."
    check: "Hold a write lock on the target file so every retry is guaranteed to fail, then run an agent that wants to write. It must stop at the cap and emit a distinct exhaustion record naming the file and the agent. A run that ends clean, or ends with the same log line as a no-op, is a finding."
    compliance_relevant: false
scene: "concurrency-cas"
order: 50
---

Optimistic concurrency control, applied to agent memory. This is the clearest instance in the
archive of the harness reclaiming a job from agent discretion.

**Is it still used?** It is the current default and there is no successor. If a semantic merge
for markdown memory appears, this becomes additive rather than superseded, because conflict
detection would still be needed to trigger the merge.
