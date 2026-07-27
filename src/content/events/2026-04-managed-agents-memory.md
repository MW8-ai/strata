---
date: "2026-04-23"
date_precision: "day"
actors: ["Anthropic"]
vendor: "anthropic"
title: "Memory for Claude Managed Agents"
what: "Public beta of a memory store for agent fleets with per-write audit trails and cross-agent sharing inside a workspace."
why: "Single-user chat memory does not survive many agents writing concurrently. Enterprises need to know who wrote what, when, and on what evidence."
how: "Memories stored as files, writes carrying audit records, a shared workspace store, and a standalone API reachable outside the agent runtime."
where: "api"
method: "filesystem-as-memory"
class: "file-as-memory"
verification: "reported"
review:
  status: "unreviewed"
  note: "Needs a first-party engineering post."
sources:
  - url: "https://usewire.io/blog/anthropic-managed-agents-memory-context-engineering/"
    title: "Anthropic's Managed Agents memory: what it changes"
    tier: "reputable"
    publisher: "Wire"
    retrieved_at: "2026-07-26"
---

Vendor-reported customer outcomes belong in prose with attribution, never in structured fields.
