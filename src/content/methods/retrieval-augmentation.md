---
name: "Retrieval augmentation"
class: "retrieval"
one_line: "Fetch relevant material from an external index at inference time and place it into the context window."
introduced: "2020"
maturity: "recommended"
lifecycle: "additive"
superseded_by: []
used_with: ["filesystem-as-memory", "progressive-disclosure"]
replaces: []
applies_to: ["llm-agnostic", "openai", "anthropic", "google", "microsoft", "single-agent", "general-purpose", "self-hosted"]
evaluation:
  good:
    - "Knowledge lives outside the weights, so it can be corrected, cited, scoped, and revoked without retraining."
    - "Scales to corpora far larger than any context window, and the economics are well understood after five years of production use."
    - "Citations are possible, which matters anywhere an answer has to be defensible."
  weak:
    - "Answer quality is capped by retrieval quality, and a confident answer built on bad retrieval looks exactly like a good one."
    - "Solves recall, not accumulation. The system can answer anything in the index and still repeat the same mistake on task fifty."
    - "Chunking and embedding choices are made once and quietly determine the ceiling for everything built on top."
  lacking:
    - "No mechanism for the system to notice its own retrieval failures and adjust."
  better_if:
    - "Retrieval failure were observable at the point of answering rather than inferred later from a bad output."
verification: "verified"
review:
  status: "reviewed"
  date: "2026-07-26"
sources:
  - url: "https://arxiv.org/abs/2005.11401"
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
    tier: "official"
    publisher: "arXiv"
    retrieved_at: "2026-07-26"
caveats:
  - severity: "warning"
    scope: "security"
    text: "Retrieved content enters the context as text the model will act on. If the index contains anything a third party can write to, retrieval is an injection path."
    compliance_relevant: true
  - severity: "note"
    scope: "operability"
    text: "Measure retrieval separately from generation. Teams that only evaluate final answers cannot tell a reasoning failure from a retrieval miss, and the fixes are unrelated."
    compliance_relevant: false
order: 5
---

Included because it is the origin of the split every later method argues about: keep knowledge
outside the weights, fetch it at inference, make the fetch the engineering problem.

**Is it still used?** Extensively, and it is `additive` rather than superseded. Memory methods did
not replace retrieval; they addressed a different failure. Retrieval answers "what do we know."
Memory answers "what have we learned." Teams that deployed retrieval and expected the second
thing were disappointed for a structural reason, not an implementation one.
