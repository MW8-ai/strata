---
date: "2026-04-23"
date_precision: "day"
actors: ["Anthropic"]
vendor: "anthropic"
title: "Memory for Claude Managed Agents"
what: "A memory store for agent fleets, in beta, with per-write audit trails and cross-agent sharing inside a workspace."
why: "Single-user chat memory does not survive many agents writing concurrently. Enterprises need to know who wrote what, when, and on what evidence."
how: "Memories stored as files, writes carrying audit records, a shared workspace store, and a standalone API reachable outside the agent runtime."
where: "api"
method: "filesystem-as-memory"
class: "file-as-memory"
verification: "verified"
review:
  status: "unreviewed"
  note: "First-party docs now confirm the mechanism: every write creates an immutable memory version, the audit trail, and a store is workspace-scoped and attachable to multiple sessions at once, the cross-agent sharing. 'Public' was dropped from the framing because nothing in the docs distinguishes public from gated access the way dreaming's research-preview waitlist does; that is an absence of evidence, not a confirmed absence of a gate."
sources:
  - url: "https://platform.claude.com/docs/en/managed-agents/memory"
    title: "Using agent memory"
    tier: "official"
    publisher: "Anthropic"
    retrieved_at: "2026-07-28"
  - url: "https://usewire.io/blog/anthropic-managed-agents-memory-context-engineering/"
    title: "Anthropic's Managed Agents memory: what it changes"
    tier: "reputable"
    publisher: "Wire"
    retrieved_at: "2026-07-26"
---

Vendor-reported customer outcomes belong in prose with attribution, never in structured fields.
