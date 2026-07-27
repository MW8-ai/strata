---
name: "Portability across vendors"
area: "storage"
question: "Does your curated memory move if you change model provider?"
coverage: "partial"
methods: ["filesystem-as-memory"]
why_it_matters: "Curated memory is an asset that took real effort to build. If it is only reachable from inside one vendor's runtime it is also a lock-in surface, and the switching cost is not the model, it is everything the model learned about your organisation."
open_questions:
  - "Is a directory of markdown genuinely portable in practice, or does the surrounding harness carry enough implicit structure to break on migration?"
  - "Is there a standard layout worth converging on, the way repository conventions converged?"
order: 100
---
