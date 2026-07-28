---
name: "Filesystem as memory"
class: "file-as-memory"
one_line: "Store memory as ordinary markdown in a directory and let the agent search and edit it with ordinary file tools."
introduced: "2026"
maturity: "recommended"
lifecycle: "current"
superseded_by: []
used_with: ["in-band-memory-tools", "hash-compare-and-swap", "tiered-permissioning", "out-of-band-consolidation"]
replaces: ["structured-memory-api"]
applies_to: ["llm-agnostic", "anthropic", "single-agent", "multi-agent", "fleet", "general-purpose", "self-hosted", "managed-service"]
evaluation:
  good:
    - "No new interface to teach. Models are already strong at bash, grep, and file editing, so capability transfers directly."
    - "Human and agent read the same artifact, so review is possible without tooling."
    - "Structure is the model's decision rather than a schema author's guess, which holds up better as needs change."
    - "Portable by construction. A directory of markdown moves between vendors; a proprietary memory object does not."
  weak:
    - "Every concurrency, permissioning, and integrity property you get free from a database has to be added back deliberately."
    - "Unbounded growth with no natural eviction. Search quality degrades as the store fills with near-duplicates."
    - "No referential integrity. Nothing stops one file contradicting another, and nothing detects it."
  lacking:
    - "No query semantics beyond text search, so aggregate questions across the store are awkward."
    - "No standard layout convention, so every implementation invents its own directory structure."
  better_if:
    - "A conventional layout emerged, the way repository conventions did, so tooling could assume structure."
    - "Deduplication ran continuously rather than only during scheduled consolidation."
verification: "reported"
review:
  status: "unreviewed"
  note: "First-party docs confirm the file-mount mechanism: a store is mounted as a directory inside the session's sandbox and the agent reads and writes it with the same file tools it uses for the rest of the filesystem. 'Markdown' describes this repository's read of the vendor's own example convention, every example path in the docs ends .md, not a stated requirement, which is why verification stays reported despite an official source."
sources:
  - url: "https://platform.claude.com/docs/en/managed-agents/memory"
    title: "Using agent memory"
    tier: "official"
    publisher: "Anthropic"
    retrieved_at: "2026-07-28"
  - url: "https://tessl.io/registry/ainativedev/aidevcon-2026-ldn/0.100.13/files/talk-lamis-context-engineering-dreaming/transcript.md"
    title: "Context Engineering, Memory Systems, and Dreaming (AI Native DevCon 2026 London)"
    tier: "reputable"
    publisher: "Tessl / AI Native Dev"
    retrieved_at: "2026-07-26"
caveats:
  - severity: "critical"
    scope: "permissioning"
    text: "A flat directory gives every agent write access to every file by default. Tier it before deployment: organisation-wide context read-only, team context write-through-review, per-agent scratchpad read-write."
    check: "Enumerate effective write permissions per agent identity across the store. Any identity with write access to the organisation tier is a finding."
    compliance_relevant: true
  - severity: "critical"
    scope: "data-retention"
    text: "The store is a durable record of everything agents thought worth keeping, including anything they read. In a regulated environment it inherits the classification of the most sensitive thing ever written to it."
    check: "Run your standard sensitive-data scanner across the whole store on a schedule, and treat the store as in-scope for the same retention and disposal policy as any other durable record."
    compliance_relevant: true
  - severity: "warning"
    scope: "portability"
    text: "Portability is the reason to choose this, and it is lost the moment the store is only reachable from inside one vendor's runtime. Insist on a standalone API over the store."
    check: "Copy the whole store to a machine with no access to the vendor runtime, then have a different vendor's agent read and edit it with ordinary file tools. Anything that stops working there is the part you cannot take with you."
    compliance_relevant: false
scene: "concurrency-cas"
order: 40
---

The design argument is that the simplest thing works. The production argument is that it only
works once four properties are added back: versioning with provenance, concurrency control,
permission tiers, and a portable API.

That list is why the sharpest question at DevCon 2026 was whether this reinvents databases.
The honest answer is partly yes and deliberately so. Primitives that proved out get moved from
agent discretion into deterministic harness code.

**Is it still used?** This is the current state of the art and the thing to build on today. Its
predecessor, the structured memory API with fixed fields, is superseded rather than additive:
there is no remaining job it does better.
