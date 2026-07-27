---
name: "What memory actually costs"
area: "evaluation"
question: "How much of your token spend is memory, and which part of it earns its keep?"
coverage: "gap"
methods: []
why_it_matters: "Instruction files are billed on every request and never appear as a user message. Consolidation has no natural ceiling and scales with transcript volume, which scales with adoption. Both are invisible in normal usage reporting, so the first sign is a bill."
open_questions:
  - "How do you attribute cost to a specific memory file or a specific consolidation run?"
  - "What is the counterfactual: what would these tasks have cost with no memory at all?"
  - "At what store size does retrieval cost exceed the savings from better one-shot rates?"
order: 120
---
