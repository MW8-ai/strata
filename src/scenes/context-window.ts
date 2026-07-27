import type { Scene } from './types';
import { CANVAS } from './types';

/**
 * Scene 1 — the constraint.
 * Teaches the difference between hard overflow and soft dilution,
 * which is the distinction most teams get wrong.
 */
const slots = 24;
const slotW = 26;
const slotH = 120;
const originX = 60;
const originY = 90;

export const contextWindow: Scene = {
  id: 'context-window',
  title: 'The context window fills, then dilutes',
  markup: () => {
    const cells = Array.from({ length: slots }, (_, i) => {
      const x = originX + i * (slotW + 2);
      return `<rect class="cw-slot" data-i="${i}" x="${x}" y="${originY}" width="${slotW}" height="${slotH}"
        fill="var(--paper-deep)" stroke="var(--rule)" stroke-width="1" opacity="0.55" />`;
    }).join('');

    return `<svg viewBox="0 0 ${CANVAS.w} ${CANVAS.h}" xmlns="http://www.w3.org/2000/svg" width="100%">
      <text x="${originX}" y="64" font-family="var(--face-util)" font-size="13"
        letter-spacing="1.4" fill="var(--ink-soft)">CONTEXT WINDOW · FIXED BUDGET</text>
      ${cells}
      <rect class="cw-wall" x="${originX + slots * (slotW + 2)}" y="${originY - 14}"
        width="3" height="${slotH + 28}" fill="var(--band-consolidation)" opacity="0" />
      <text class="cw-wall-label" x="${originX + slots * (slotW + 2) + 12}" y="${originY + 8}"
        font-family="var(--face-util)" font-size="12" fill="var(--band-consolidation)" opacity="0">HARD LIMIT</text>
      <text class="cw-signal-label" x="${originX}" y="${originY + slotH + 34}"
        font-family="var(--face-util)" font-size="12" fill="var(--band-context-window)" opacity="0">
        the instruction you actually needed
      </text>
    </svg>`;
  },
  steps: [
    {
      caption:
        'The window is a fixed budget of tokens. Empty, it holds everything you send in one pass.',
      build: (tl, svg) => {
        tl.to(svg.querySelectorAll('.cw-slot'), { opacity: 0.55, duration: 0.2 });
      },
    },
    {
      caption:
        'One instruction matters more than the rest. Early on it has the model\u2019s full attention.',
      build: (tl, svg) => {
        tl.to(svg.querySelector('.cw-slot[data-i="2"]'), {
          fill: 'var(--band-context-window)',
          opacity: 1,
          duration: 0.35,
        }).to(svg.querySelector('.cw-signal-label'), { opacity: 1, duration: 0.3 }, '<');
      },
    },
    {
      caption:
        'Session history accumulates. Nothing has overflowed yet, so nothing looks wrong.',
      build: (tl, svg) => {
        const filler = Array.from(svg.querySelectorAll<SVGRectElement>('.cw-slot')).filter(
          (r) => r.dataset.i !== '2'
        );
        tl.to(filler, {
          fill: 'var(--rule-hair)',
          opacity: 0.95,
          duration: 0.5,
          stagger: 0.03,
        });
      },
    },
    {
      caption:
        'This is dilution, the soft failure. Everything still fits. The signal is now one band among twenty-four and attention is spread across all of them.',
      build: (tl, svg) => {
        tl.to(svg.querySelector('.cw-slot[data-i="2"]'), { opacity: 0.42, duration: 0.6 });
      },
    },
    {
      caption:
        'Overflow is the hard failure and the easier one to notice. Dilution degrades quality with no error at all, which is why unmanaged instruction files fail long before they run out of room.',
      build: (tl, svg) => {
        tl.to([svg.querySelector('.cw-wall'), svg.querySelector('.cw-wall-label')], {
          opacity: 1,
          duration: 0.3,
        });
      },
    },
  ],
};
