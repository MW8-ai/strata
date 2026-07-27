import { defineConfig } from 'astro/config';

// GitHub Pages project site. Change `base` if you rename the repo,
// or drop it entirely if you deploy to a user/org root site.
export default defineConfig({
  site: 'https://MW8-ai.github.io',
  base: '/strata',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
