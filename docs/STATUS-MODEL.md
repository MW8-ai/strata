# The status model

The single most important design decision in this repository: **maturity and lifecycle are
two independent fields and never collapse into one.**

## Why one field does not work

Ask what status `CLAUDE.md`-style instruction injection has today. Any single answer is
wrong:

- "Recommended" hides that it is no longer the whole answer.
- "Legacy" is false. It is shipped, documented, and still the first thing to do on a new project.
- "Superseded" is worse. Nothing replaced it.

The true statement needs both axes: **maturity `recommended`, lifecycle `additive`.** Shipped
and supported, and now one layer among several. Every tracker that uses a single status field
loses that sentence, and that sentence is the reason to read the site at all.

## Maturity: what the vendor says about readiness

| Value | Means |
|---|---|
| `recommended` | The vendor's current documented default. |
| `preview` | Research preview or public beta. Interface may change. |
| `development` | Announced, incomplete, not generally usable. |
| `prototype` | Demonstrated somewhere, productised by nobody. |

Maturity is close to a reported fact. It follows the vendor's own language, so it is checkable
against a source and does not require judgement.

## Lifecycle: whether you should still reach for it

| Value | Means |
|---|---|
| `current` | Reach for this first. Nothing has replaced it. |
| `additive` | Still correct. Now one layer among several. |
| `superseded` | Something replaced it for the same job. |
| `withdrawn` | Removed or actively discouraged. |

Lifecycle is a judgement about the field, not a vendor statement. It is the field most likely
to be wrong and the one most worth arguing about in a pull request.

## The distinction that does the work

**Additive versus superseded** is the question a returning reader actually has, and it is the
one most sites answer badly. The test:

> Is there still a job this method does better than its successor?

Yes, it is `additive`. No, it is `superseded`.

In-band memory tools are `additive` even though out-of-band consolidation is newer and wider,
because in-band closes the loop within one session and consolidation cannot. The structured
memory API is `superseded` for agent workloads because there is no remaining job it does
better than a filesystem store.

## Rules the build enforces

- `superseded` requires `superseded_by`. Superseded by what?
- `superseded` or `withdrawn` requires a `sunset` date, even approximate.
- `current` and a non-empty `superseded_by` is a contradiction and is rejected.
- `recommended` maturity cannot rest on `unknown` verification.
- Circular supersession between two methods is rejected.
- `evaluation.good` and `evaluation.weak` must both be non-empty. A method with no listed
  weakness has been advertised, not evaluated.
- A `current` method with no caveats raises a warning. Silence there is nearly always
  incompleteness rather than a clean bill of health.

## Two more independent flags

**Verification** describes the claim: `verified`, `reported`, `unknown`.
**Review** describes whether a person has read the entry: `reviewed` with a date, or `unreviewed`.

Neither implies the other. An entry can be sourced to first-party documentation and still be
unreviewed, which is why both render as separate badges. `structured-memory-api` is the worked
example in the seed data: the source tier is `official`, the verification is `reported`, because
the characterisation in the entry body is the author's reading rather than a vendor statement.

## Caveats

Severity is `critical`, `warning`, or `note`. Scope is a bounded vocabulary:
permissioning, concurrency, security, cost, latency, data-retention, portability, operability.

`compliance_relevant: true` marks a caveat that is a hard gate in a regulated deployment
rather than an engineering preference. Those render with a visible tag, because for anyone
working inside an audit boundary that flag is the difference between a note and a blocker.

The permissioning caveats are written to be verifiable by action rather than by reading
configuration. "Attempt a write from a task agent and confirm the refusal" is a test.
"Ensure permissions are configured" is not.
