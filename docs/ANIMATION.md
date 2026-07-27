# Animation contract

## Why SVG and GSAP

**SVG, hand-authored, in TypeScript modules.** Scenes stay diffable in git, reviewable in a
pull request, and derivable from the same tokens as the rest of the site. A binary animation
file would be easier to author and impossible to review, which is the wrong trade for a
governance repo.

**GSAP for sequencing.** The scenes need labelled steps, reverse scrubbing, and the ability
to jump to an arbitrary point. The Web Animations API handles individual tweens well and
handles orchestration badly. If GSAP's licence terms change in a way that matters for this
repo, `src/scenes/registry.ts` is the only file that imports it and the timeline interface in
`types.ts` is deliberately thin.

## Rules for a new scene

1. **Step-driven, never scroll-driven.** These get presented to rooms. The presenter controls
   the pace, not the scroll position. A scene that advances while someone is reading the
   caption is worse than a static diagram.
2. **Every step has a caption that stands alone.** The caption is the teaching. The animation
   is the illustration. If the captions read as a coherent explanation with the SVG removed,
   the scene is good. If they read as stage directions, it is not.
3. **Reduced motion is a first-class path, not a fallback.** Under
   `prefers-reduced-motion: reduce` the timeline still advances, at effectively zero
   duration, so every end state is reachable. Nothing is gated behind seeing the movement.
4. **Colour comes from tokens.** Scenes use `var(--band-*)` so a class recolour propagates.
   No literal hex values in a scene module.
5. **One idea per scene.** The three shipped scenes each carry exactly one argument: the
   window dilutes before it overflows; concurrent writers lose updates without a hash guard;
   a pattern across sessions is invisible from inside one.
6. **Words go in `text`, movement goes in `build`.** A label a step puts on screen is declared
   in that step's `text` map, as selector to string, and the registry applies it from the step
   index. Never set `textContent` from a timeline callback: callbacks run on the forward pass
   only, so stepping back would leave a later step's label sitting under an earlier step's
   caption, which is the one failure mode a teaching aid cannot have.

## Adding a scene

Create `src/scenes/<id>.ts` exporting a `Scene`, register it in `registry.ts`, then set
`scene: "<id>"` in the relevant primitive's frontmatter. `npm run verify` fails if a primitive
references an unregistered scene.

## Accessibility floor

Controls are real buttons and keyboard reachable. The step counter is `aria-live="polite"`.
The SVG mount carries `role="img"` with a label. Focus is visible everywhere.
