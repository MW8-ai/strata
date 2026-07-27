---
name: "Measuring whether memory helped"
area: "evaluation"
question: "How do you tell that a memory system improved outcomes rather than just accumulated text?"
coverage: "gap"
methods: []
why_it_matters: "Accuracy, cost, and latency improvements are stated as observations throughout the field, largely without numbers. Without a benchmark there is no way to compare two memory designs, no way to detect regression, and no way to justify the spend to anyone who asks."
open_questions:
  - "What is the unit of measurement: task success, token spend, time to first correct answer?"
  - "How do you separate memory quality from retrieval quality from model capability?"
  - "How does memory evaluation relate to existing eval loops, which address an overlapping problem from a different direction?"
order: 80
---
The most consequential gap for anyone who has to defend a budget.
