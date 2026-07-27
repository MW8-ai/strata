---
name: "Anthropic"
slug: "anthropic"
stance: "Memory as a filesystem the model manages itself, with production guardrails moved into the harness once they prove out."
current_default: "filesystem-as-memory"
feed_ids: []
---

Stated design principle is to do the simple thing that works, then codify what survives
contact with production. The visible arc runs from a single instruction file, to
autonomous read and write tools, to progressive disclosure, to plain markdown in a
directory, to versioning and compare-and-swap in the harness around it.
