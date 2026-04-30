// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://pitabread8.github.io',
  base: '/artemis',
  integrations: [mdx()],
});
