---
name: "Progressive disclosure (skills)"
class: "progressive-disclosure"
one_line: "Expose a short description for discovery and load the full body only when the description matches the task."
introduced: "2025"
maturity: "recommended"
lifecycle: "current"
superseded_by: []
used_with: ["instruction-file-injection", "filesystem-as-memory"]
replaces: []
applies_to: ["llm-agnostic", "anthropic", "single-agent", "multi-agent", "coding", "general-purpose"]
evaluation:
  good:
    - "Decouples depth from cost. A procedure can run to thousands of words and cost nothing until it is needed."
    - "Directly fixes the dilution failure of unconditional instruction files."
    - "The unit is a file, so procedures are reviewable, versioned, and shareable across a team."
  weak:
    - "Discovery is only as good as the description, and the description is usually written last and least carefully."
    - "Failure is silent. A badly described skill is never loaded, and the agent behaves exactly as though it does not exist."
    - "Still authored by humans deciding what deserves a skill, so coverage reflects what somebody thought to write down."
  lacking:
    - "No usage telemetry in the base pattern. You cannot tell which skills are never loading and why."
    - "No conflict handling when two skills claim the same territory."
  better_if:
    - "Load decisions were logged so a missed match could be diagnosed instead of guessed at."
    - "Descriptions were tested against real task phrasings the way a search relevance set is tested."
verification: "verified"
review:
  status: "reviewed"
  date: "2026-07-26"
  note: "Mechanism confirmed against first-party documentation."
sources:
  - url: "https://www.anthropic.com/news/agent-skills"
    title: "Agent Skills"
    tier: "official"
    publisher: "Anthropic"
    retrieved_at: "2026-07-26"
caveats:
  - severity: "warning"
    scope: "operability"
    text: "The description is a routing decision, not documentation. It is the highest leverage text in the file. Budget real effort for it and revise it when a skill fails to fire."
    check: "Write ten task prompts a user would plausibly phrase for a given skill, without reusing the description's wording, and run them with only the descriptions visible. Record how many load the right skill. Track that number per skill and treat a fall in it as a routing regression, not as user error."
    compliance_relevant: false
  - severity: "note"
    scope: "security"
    text: "A skill body is instructions the model will follow. Skills sourced from outside your organisation are executable content and warrant the same review as a dependency."
    check: "List every installed skill and name the person who reviewed its body and the revision they reviewed. Then confirm an updated third-party skill cannot reach agents without a fresh review, by pushing a changed body upstream and watching whether it loads. Silent adoption of a new revision is a finding."
    compliance_relevant: true
order: 30
---

The bookshelf analogy is the fastest way to teach it: you scan spines, not pages. The French
dictionary costs nothing until someone speaks French to you.

**Is it still used?** It is the current default for anything procedural. It has not been
superseded and there is no visible successor. The open problem is discovery quality, not the
pattern itself.
