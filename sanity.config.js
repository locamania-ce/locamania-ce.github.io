import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes.js'

export default defineConfig({
  name: 'locamania',
  title: 'Locamanía — Contenidos',
  projectId: 'lnybj8p0',
  dataset: 'locomania-taller',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
