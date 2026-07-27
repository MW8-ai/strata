---
name: "Prompt injection through memory"
area: "security"
question: "What stops content an agent reads during a task from writing attacker-chosen text into a store other agents will trust?"
coverage: "partial"
methods: ["tiered-permissioning", "in-band-memory-tools"]
why_it_matters: "Memory turns a transient injection into a persistent one. Content read during one task can instruct an agent to record something, and that record then enters the context of every future session, potentially across a whole team."
open_questions:
  - "Should memory writes be treated as untrusted at read time, and what would that mean operationally?"
  - "Can a write be attributed back to the specific content that prompted it, well enough to revoke a poisoned lineage?"
order: 90
---
Partially covered: permission tiers bound the damage, and nothing prevents the write.
