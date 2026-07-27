---
name: "Many writers, one store"
area: "governance"
question: "What happens when several agents edit the same memory at the same time?"
coverage: "covered"
methods: ["hash-compare-and-swap"]
why_it_matters: "The failure is silent. No error, no log line, no way to detect it afterwards. Teams running a single agent have this problem latent and invisible until the day they scale to two."
open_questions:
  - "Can markdown memory be merged semantically rather than only conflict-detected?"
order: 30
---
