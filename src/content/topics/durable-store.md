---
name: "Where memory actually lives"
area: "storage"
question: "What is the storage substrate for things an agent should remember between sessions?"
coverage: "covered"
methods: ["filesystem-as-memory", "structured-memory-api", "in-band-memory-tools"]
why_it_matters: "The substrate choice determines what is possible later. Fixed fields make policy easy and evolution hard; a filesystem makes evolution easy and every database guarantee something you have to rebuild."
open_questions:
  - "Is there a middle form with advisory rather than enforced structure?"
order: 20
---
The clearest supersession in the archive, and the best worked example of the difference
between a method being joined by a successor and being replaced by one.
