import type { gsap } from 'gsap';

export interface SceneStep {
  /** Caption shown while this step is active. Written for a reader, not a spec. */
  caption: string;
  /**
   * Text content this step establishes, as selector to string. Applied from
   * the step index rather than from the timeline, because a timeline callback
   * fires on the forward pass only: scrubbing back would leave a later step's
   * label on screen under an earlier step's caption. Anything the eye reads as
   * a word belongs here; anything it reads as movement belongs in `build`.
   */
  text?: Record<string, string>;
  /** Builds this step onto the shared timeline. */
  build: (tl: gsap.core.Timeline, svg: SVGSVGElement) => void;
}

export interface Scene {
  id: string;
  title: string;
  /** Returns the SVG markup for the scene at rest, before any animation. */
  markup: () => string;
  steps: SceneStep[];
}

/** Shared drawing constants so scenes look like one hand drew them. */
export const CANVAS = { w: 800, h: 420 };
export const INK = 'var(--ink)';
export const RULE = 'var(--rule)';
