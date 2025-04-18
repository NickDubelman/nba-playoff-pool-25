import { defineConfig } from 'astro/config'
import db from '@astrojs/db'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import netlify from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  integrations: [db(), svelte(), tailwind()],
  output: 'server',
  adapter: netlify(),
  security: {
    checkOrigin: false,
  },
})
