# The topic map

## Why this exists

A tracker that lists only what exists implies the field is finished. It is not, and the parts
nobody has solved are more useful to an architect than the parts everybody has.

Topics are the questions underneath the methods. Methods are answers. Some questions have good
answers, some have partial ones, and some have none.

## Coverage

| Value | Means | Rule |
|---|---|---|
| `covered` | At least one method addresses this and works. | Must list methods. |
| `partial` | Addressed, with a known hole. | Lists methods and open questions. |
| `gap` | Identified, nothing addresses it well. | Cannot list methods. Must list open questions. |

The build enforces all three. A `gap` with no open questions is an omission wearing a label,
and it is rejected.

## Why it serves both the day visitor and the year-long reader

**For a day:** this is the orientation map. Twelve questions is a smaller thing to hold than
nine methods plus their supersession relationships, and the questions survive the answers.

**For a year:** the covered topics will barely move. The `gap` entries are the only part that
should change, and **a gap moving to partial is the most informative event this site can
record.** It means somebody solved something. That is worth more than any number of feed items.

## Adding a topic

Phrase `question` as an actual question ending in a question mark; the build checks this.
`why_it_matters` should say what goes wrong for a real team, not why the topic is intellectually
interesting.

Every method should be reachable from at least one topic. The gate warns when one is not,
because an unreachable method means the map has a hole.
