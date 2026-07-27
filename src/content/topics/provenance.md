---
name: "Provenance and audit of writes"
area: "governance"
question: "Six months later, can you answer which agent wrote this, from which session, and who approved it?"
coverage: "partial"
methods: ["tiered-permissioning", "filesystem-as-memory"]
why_it_matters: "This is the question an incident review opens with. Per-write audit records exist in current implementations, but there is no standard query for answering it, and the refused writes, which say the most about a misconfigured agent, are usually not recorded at all."
open_questions:
  - "Should a refused write be logged as loudly as a successful one?"
  - "What is the minimum audit record that would satisfy an auditor rather than an engineer?"
order: 110
---
