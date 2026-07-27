---
name: "Structured memory API"
class: "file-as-memory"
one_line: "A purpose-built memory interface with fixed fields and a bespoke read/write API the model must be taught."
introduced: "2024"
sunset: "2026"
maturity: "recommended"
lifecycle: "superseded"
superseded_by: ["filesystem-as-memory"]
used_with: []
replaces: []
applies_to: ["llm-agnostic", "openai", "single-agent", "general-purpose", "managed-service"]
evaluation:
  good:
    - "Predictable shape. Fixed fields make the store trivially queryable and easy to display in a settings UI."
    - "Easy to enforce policy against, because the schema states exactly what can be stored."
    - "Straightforward user-facing view, edit, and delete controls, which is why consumer products landed here first."
  weak:
    - "The schema author has to predict what will be worth remembering, and that prediction ages badly."
    - "Anything that does not fit the fields is either discarded or crammed into a notes field, which defeats the structure."
    - "The model has to learn a bespoke interface instead of using capabilities it already has."
  lacking:
    - "No way for the model to reorganise the store as its understanding of the domain changes."
  better_if:
    - "The schema had been advisory rather than enforced, allowing overflow into free text without penalty."
verification: "reported"
review:
  status: "unreviewed"
  note: "The source is first-party, but the fixed-field characterisation below is the author's reading of the implementation rather than a vendor statement. That is why the tier is official and the verification is only reported: tier describes the source, verification describes the claim."
sources:
  - url: "https://openai.com/index/memory-and-new-controls-for-chatgpt/"
    title: "Memory and new controls for ChatGPT"
    tier: "official"
    publisher: "OpenAI"
    retrieved_at: "2026-07-26"
caveats:
  - severity: "note"
    scope: "portability"
    text: "Superseded for agent workloads does not mean gone. Consumer memory surfaces still use fixed-field stores because the user-facing edit and delete controls are simpler to build against a schema."
    check: "Before migrating a fixed-field store to a filesystem store, list the user-facing controls the schema currently makes possible, view, edit, delete and export among them, and say for each how it will be served afterwards. Any control with no answer is a capability the migration removes."
    compliance_relevant: false
order: 45
---

Present in this archive as the contrast case. Read the two entries together: the argument
against fixed fields is the argument for the filesystem, and it is the clearest example in
the archive of a method being genuinely superseded rather than merely joined by a newer one.

**Is it still used?** For agent memory, no. For consumer-facing memory with user edit controls,
the fixed-field shape persists because the constraint there is UI legibility rather than model
flexibility. Worth knowing before you conclude the pattern is dead everywhere.
