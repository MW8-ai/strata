---
name: "Forgetting and eviction"
area: "lifecycle"
question: "What decides that a memory should be removed, and who is accountable for the removal?"
coverage: "gap"
methods: []
why_it_matters: "Every store in this archive grows without bound. Consolidation prunes opportunistically, on a schedule, as a side effect of looking for patterns. Nothing in the field treats forgetting as a first-class operation with its own policy, and a store that only accumulates degrades its own search quality."
open_questions:
  - "Should eviction be time-based, usage-based, contradiction-based, or explicitly curated?"
  - "How do you distinguish a memory that stopped being true from one that is simply rarely needed?"
  - "Who is accountable when a removed memory turns out to have been load-bearing?"
  - "Is there an equivalent of a retention schedule for agent memory, and would a regulator accept one?"
order: 60
---
The clearest open problem in the archive. Every method here has an unbounded-growth weakness
listed, and none of them names a mechanism for the reverse operation.
