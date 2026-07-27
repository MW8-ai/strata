# Source policy

Inherited from CloudIntelMatrix, adapted for a historical archive rather than a
point-in-time capability matrix.

## Tier is a property of the source. Verification is a property of the claim.

These are two fields and they never collapse into one. A `community` source can support a
claim you are confident about; an `official` source can be a press release that says nothing
checkable. Keeping them separate is what lets the archive be honest about a well-known event
that has no first-party documentation.

| Tier | Definition | Can support `verified`? |
|---|---|---|
| `official` | First-party. The organisation describing its own work. | Yes |
| `reputable` | Independent, edited, accountable for corrections. | No, supports `reported` |
| `community` | Useful but unedited or unattributed. | No, supports `reported` at most |

## Verification states

- **`verified`** — at least one `official` source. Build-enforced.
- **`reported`** — at least one source of any tier, none of them official.
- **`unknown`** — the claim is in the archive because it matters, and the evidence is not
  there yet.

## Unknown is not none

An event with no confirmed date is `unknown` and renders as an open dotted outline. It is
never padded to January 1 of a plausible year. The schema explicitly rejects a `-01-01` date
carrying `date_precision: "day"`, because that pattern is almost always a year wearing a
disguise.

Likewise, a vendor with no entries has an empty profile that says so. Absence of evidence
renders as absence of evidence.

## Provisional

`provisional: true` means the entry has been written but not reviewed by a second person. It
renders with a visible chip. An entry cannot be both `verified` and `provisional`; the build
rejects that combination.

## What never enters the repository

- Article body text, from any source, at any length.
- Close paraphrase that preserves the original's structure or phrasing.
- Vendor performance claims in structured fields. Those belong in prose, attributed, with
  the vendor named as the source of the number.

The feed lane stores a title, a URL, a publication date, and a source id. Nothing else.

## Retraction

If a source is retracted or a date is corrected, edit the entry in place and note the change
in the body. Do not delete the entry. The git history is part of the archive's value, and an
entry that was wrong for eight months is itself a fact about how the field reported itself.
