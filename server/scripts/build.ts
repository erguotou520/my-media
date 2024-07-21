import packageJson from '../package.json'

function getExternalsFromPackageJson(): string[] {
  return Array.from(new Set(Object.keys(packageJson.dependencies || {})))
}

async function buildWithExternals(): Promise<void> {
  const externalDeps = getExternalsFromPackageJson()

  await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'bun',
    external: externalDeps,
    sourcemap: 'external'
  })

  await Bun.build({
    entrypoints: ['./src/db/seed.ts', './src/db/drizzle.config.ts', './src/db/schema.ts'],
    outdir: './dist/db',
    target: 'bun',
    external: externalDeps,
  })
}

buildWithExternals()
