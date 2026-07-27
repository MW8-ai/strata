import type { Scene } from './types';
import { CANVAS } from './types';

/**
 * Scene 2 — why a shared markdown file needs compare-and-swap.
 * The lost-update problem, then the hash guard that prevents it.
 */
export const concurrencyCas: Scene = {
  id: 'concurrency-cas',
  title: 'Two agents, one memory file',
  markup: () => `<svg viewBox="0 0 ${CANVAS.w} ${CANVAS.h}" xmlns="http://www.w3.org/2000/svg" width="100%">
    <rect x="330" y="150" width="140" height="120" fill="var(--paper-deep)"
      stroke="var(--rule)" stroke-width="1.5" />
    <text x="400" y="140" text-anchor="middle" font-family="var(--face-util)" font-size="12"
      letter-spacing="1.2" fill="var(--ink-soft)">team-memory.md</text>
    <text class="cas-hash" x="400" y="215" text-anchor="middle" font-family="var(--face-util)"
      font-size="15" fill="var(--ink)">a1f3</text>

    <g class="cas-a">
      <rect x="40" y="60" width="130" height="52" fill="none" stroke="var(--band-retrieval)" stroke-width="1.5" />
      <text x="105" y="92" text-anchor="middle" font-family="var(--face-util)" font-size="12"
        fill="var(--band-retrieval)">AGENT A</text>
    </g>
    <g class="cas-b">
      <rect x="40" y="300" width="130" height="52" fill="none" stroke="var(--band-file-as-memory)" stroke-width="1.5" />
      <text x="105" y="332" text-anchor="middle" font-family="var(--face-util)" font-size="12"
        fill="var(--band-file-as-memory)">AGENT B</text>
    </g>

    <circle class="cas-read-a" cx="105" cy="86" r="7" fill="var(--band-retrieval)" opacity="0" />
    <circle class="cas-read-b" cx="105" cy="326" r="7" fill="var(--band-file-as-memory)" opacity="0" />
    <text class="cas-verdict" x="400" y="380" text-anchor="middle" font-family="var(--face-util)"
      font-size="13" fill="var(--band-consolidation)" opacity="0"></text>
  </svg>`,
  steps: [
    {
      caption:
        'Both agents read the shared file. Each records the hash of what it read: a1f3.',
      build: (tl, svg) => {
        tl.to([svg.querySelector('.cas-read-a'), svg.querySelector('.cas-read-b')], {
          opacity: 1,
          duration: 0.3,
        })
          .to(svg.querySelector('.cas-read-a'), { attr: { cx: 330, cy: 180 }, duration: 0.6 })
          .to(svg.querySelector('.cas-read-b'), { attr: { cx: 330, cy: 240 }, duration: 0.6 }, '<');
      },
    },
    {
      caption:
        'Agent A drafts an edit and commits. The file content changes, so the hash changes to b7c2.',
      build: (tl, svg) => {
        tl.to(svg.querySelector('.cas-read-a'), { attr: { cx: 400, cy: 215 }, duration: 0.5 })
          .to(svg.querySelector('.cas-hash'), { opacity: 0, duration: 0.15 })
          .call(() => {
            const h = svg.querySelector('.cas-hash');
            if (h) h.textContent = 'b7c2';
          })
          .to(svg.querySelector('.cas-hash'), { opacity: 1, duration: 0.15 });
      },
    },
    {
      caption:
        'Without a guard, Agent B now writes the draft it built from a1f3. Agent A\u2019s update is gone and nothing reports an error. This is the lost update.',
      build: (tl, svg) => {
        const v = svg.querySelector('.cas-verdict');
        tl.call(() => {
          if (v) v.textContent = 'A\u2019S WRITE SILENTLY OVERWRITTEN';
        }).to(v, { opacity: 1, duration: 0.3 });
      },
    },
    {
      caption:
        'With the guard, Agent B hashes again immediately before committing. b7c2 does not match the a1f3 it read, so the write is refused.',
      build: (tl, svg) => {
        const v = svg.querySelector('.cas-verdict');
        tl.call(() => {
          if (v) v.textContent = 'HASH MISMATCH \u00b7 WRITE REFUSED';
        }).to(svg.querySelector('.cas-read-b'), { attr: { cx: 105, cy: 326 }, duration: 0.6 });
      },
    },
    {
      caption:
        'Agent B re-reads, re-drafts against the current state, and retries. This is optimistic concurrency control, and it is the reason plain markdown survives a fleet.',
      build: (tl, svg) => {
        const v = svg.querySelector('.cas-verdict');
        tl.call(() => {
          if (v) v.textContent = 'RE-READ \u00b7 RE-DRAFT \u00b7 RETRY';
        }).to(svg.querySelector('.cas-read-b'), { attr: { cx: 400, cy: 215 }, duration: 0.7 });
      },
    },
  ],
};
