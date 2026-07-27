import { gsap } from 'gsap';
import type { Scene } from './types';
import { contextWindow } from './context-window';
import { concurrencyCas } from './concurrency-cas';
import { consolidation } from './consolidation';

export const SCENES: Record<string, Scene> = {
  [contextWindow.id]: contextWindow,
  [concurrencyCas.id]: concurrencyCas,
  [consolidation.id]: consolidation,
};

export function listScenes(): Scene[] {
  return Object.values(SCENES);
}

/**
 * Mounts a scene into a SceneStage host element.
 *
 * Contract:
 *  - Steps are discrete and human-driven. Nothing autoplays on scroll,
 *    because a teaching aid that moves while you are reading it is worse
 *    than a static diagram.
 *  - Under prefers-reduced-motion the timeline still advances, at
 *    effectively zero duration, so the end state of every step is reachable.
 */
export function mountScene(id: string, host: HTMLElement): void {
  const scene = SCENES[id];
  if (!scene) {
    console.warn(`[strata] unknown scene "${id}"`);
    return;
  }

  const mount = host.querySelector<HTMLElement>('[data-scene-mount]');
  const caption = host.querySelector<HTMLElement>('[data-scene-caption]');
  const progress = host.querySelector<HTMLElement>('[data-scene-progress]');
  if (!mount) return;

  mount.innerHTML = scene.markup();
  const svg = mount.querySelector('svg');
  if (!svg) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timeScale = reduce ? 40 : 1;

  const labels: string[] = [];
  const tl = gsap.timeline({ paused: true });
  tl.timeScale(timeScale);

  scene.steps.forEach((step, i) => {
    const label = `step-${i}`;
    labels.push(label);
    tl.addLabel(label);
    step.build(tl, svg);
  });

  let index = 0;

  const render = () => {
    if (caption) caption.textContent = scene.steps[index]?.caption ?? '';
    if (progress) progress.textContent = `${index + 1} / ${scene.steps.length}`;
  };

  const goto = (next: number) => {
    index = Math.max(0, Math.min(scene.steps.length - 1, next));
    tl.tweenTo(index === scene.steps.length - 1 ? tl.duration() : labels[index + 1], {
      duration: reduce ? 0.01 : undefined,
    });
    render();
  };

  host.querySelector('[data-scene-next]')?.addEventListener('click', () => goto(index + 1));
  host.querySelector('[data-scene-prev]')?.addEventListener('click', () => goto(index - 1));
  host.querySelector('[data-scene-replay]')?.addEventListener('click', () => {
    tl.pause(0);
    index = 0;
    goto(0);
  });

  goto(0);
}
