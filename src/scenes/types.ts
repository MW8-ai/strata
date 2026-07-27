import type { gsap } from 'gsap';

export interface SceneStep {
  /** Caption shown while this step is active. Written for a reader, not a spec. */
  caption: string;
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
