---
name: "Contradictory memories"
area: "governance"
question: "What happens when two memories disagree, and how would anyone notice?"
coverage: "gap"
methods: []
why_it_matters: "A filesystem store has no referential integrity. Nothing stops one file asserting the opposite of another, nothing detects it, and the agent will act on whichever it retrieves. In a store curated by many agents over months this is a certainty rather than a risk."
open_questions:
  - "Should contradiction be detected at write time, at read time, or during consolidation?"
  - "Is contradiction always an error, or sometimes a legitimate record of a changed decision?"
  - "How do you represent supersession inside a memory store the way this site represents it between methods?"
order: 70
---
