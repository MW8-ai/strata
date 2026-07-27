import type { Scene } from './types';
import { CANVAS } from './types';

/**
 * Scene 3 — out-of-band consolidation.
 * The point of the animation is the visibility argument: one session
 * cannot see a pattern that only exists across sessions.
 */
const N = 12;

export const consolidation: Scene = {
  id: 'consolidation',
  title: 'A pattern no single session can see',
  markup: () => {
    const cards = Array.from({ length: N }, (_, i) => {
      const x = 60 + (i % 6) * 108;
      const y = 70 + Math.floor(i / 6) * 76;
      const flawed = [1, 4, 7, 9, 10].includes(i);
      return `<g class="cons-card" data-flawed="${flawed}" data-i="${i}">
        <rect x="${x}" y="${y}" width="88" height="56" fill="var(--paper-deep)"
          stroke="var(--rule)" stroke-width="1" />
        <rect class="cons-flag" x="${x}" y="${y}" width="88" height="56"
          fill="var(--band-consolidation)" opacity="0" />
      </g>`;
    }).join('');

    return `<svg viewBox="0 0 ${CANVAS.w} ${CANVAS.h}" xmlns="http://www.w3.org/2000/svg" width="100%">
      <text x="60" y="48" font-family="var(--face-util)" font-size="13" letter-spacing="1.4"
        fill="var(--ink-soft)">SESSION TRANSCRIPTS \u00b7 ONE BATCH</text>
      ${cards}
      <rect class="cons-lens" x="52" y="62" width="620" height="150" fill="none"
        stroke="var(--band-context-window)" stroke-width="2" stroke-dasharray="6 4" opacity="0" />
      <text class="cons-out" x="60" y="330" font-family="var(--face-util)" font-size="13"
        fill="var(--band-context-window)" opacity="0"></text>
      <text class="cons-stat" x="60" y="356" font-family="var(--face-util)" font-size="12"
        fill="var(--ink-soft)" opacity="0"></text>
    </svg>`;
  },
  steps: [
    {
      caption:
        'Twelve sessions ran. Each agent completed its task and each saw only its own transcript.',
      build: (tl, svg) => {
        tl.from(svg.querySelectorAll('.cons-card'), { opacity: 0, duration: 0.4, stagger: 0.04 });
      },
    },
    {
      caption:
        'Five of them hit the same tool misconfiguration. Inside any one session it reads as a one-off, not a pattern.',
      build: (tl, svg) => {
        tl.to(svg.querySelectorAll('.cons-card[data-flawed="true"] .cons-flag'), {
          opacity: 0.28,
          duration: 0.4,
          stagger: 0.08,
        });
      },
    },
    {
      caption:
        'Consolidation runs out of band, after the fact, with its own token budget. It reads the whole batch at once, including tool calls and metadata rather than only the text turns.',
      build: (tl, svg) => {
        tl.to(svg.querySelector('.cons-lens'), { opacity: 1, duration: 0.4 });
      },
    },
    {
      caption:
        'Now the pattern is visible, because visibility was the missing input all along, not intelligence.',
      build: (tl, svg) => {
        tl.to(svg.querySelectorAll('.cons-card[data-flawed="true"] .cons-flag'), {
          opacity: 0.85,
          duration: 0.35,
        });
      },
    },
    {
      caption:
        'The output is a proposed diff against the memory store, carrying example transcripts and prevalence stats so a human can judge it. The human accepts or rejects. The store never updates itself.',
      build: (tl, svg) => {
        const out = svg.querySelector('.cons-out');
        const stat = svg.querySelector('.cons-stat');
        tl.call(() => {
          if (out) out.textContent = 'PROPOSED: add tool-config note to team-memory.md';
          if (stat) stat.textContent = 'prevalence 5 of 12 sessions \u00b7 3 example transcripts attached \u00b7 awaiting review';
        })
          .to(out, { opacity: 1, duration: 0.3 })
          .to(stat, { opacity: 1, duration: 0.3 }, '<0.1');
      },
    },
  ],
};
