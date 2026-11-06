// Validates registry.json and every entry's taps.json (no dependencies, plain Node).
// Mirrors the manifest essentials from taps.engine's tap-manifest schema.
const IDS = /^[a-z][a-z0-9-]{0,40}$/
const RUNTIMES = ['bun', 'node', 'frankenphp', 'static', 'self', 'module']
const fail = (msg) => {
  console.error(`registry: ${msg}`)
  process.exitCode = 1
}

const entries = JSON.parse(await import('node:fs').then((fs) =>
  fs.readFileSync(new URL('../registry.json', import.meta.url), 'utf8'),
))
if (!Array.isArray(entries) || !entries.length) fail('registry.json is not a non-empty array')
const seen = new Set()
const ids = []
for (const [i, e] of entries.entries()) {
  const where = `entry ${i} (${e?.id ?? '?'})`
  for (const f of ['id', 'name', 'version', 'description', 'author', 'repo', 'runtime']) {
    if (typeof e?.[f] !== 'string' || !e[f].trim()) fail(`${where}: ${f} is required`)
  }
  if (!IDS.test(e?.id ?? '')) fail(`${where}: bad id`)
  if (seen.has(e.id)) fail(`${where}: duplicate id`)
  seen.add(e.id)
  ids.push(e.id)
  if (!RUNTIMES.includes(e.runtime)) fail(`${where}: bad runtime ${e.runtime}`)
  if (!Array.isArray(e.tags) || e.tags.length > 6 || e.tags.some((t) => typeof t !== 'string'))
    fail(`${where}: tags is up to six strings`)
  for (const f of ['repo', 'tapsJson', 'icon']) {
    if (typeof e[f] !== 'string') fail(`${where}: ${f} must be a string`)
    else if (e[f] && !e[f].startsWith('https://')) fail(`${where}: ${f} must be HTTPS`)
  }
  if (e.verified !== false) fail(`${where}: verified must be false`)
  if (e.subdir !== undefined && (typeof e.subdir !== 'string' || e.subdir.startsWith('/')))
    fail(`${where}: subdir is a relative path`)
  if (e.builtin !== undefined && e.builtin !== true) fail(`${where}: builtin is true or absent`)
  if (e.builtin && e.tapsJson) fail(`${where}: a built-in entry carries no tapsJson`)
  if (!e.builtin && !e.tapsJson) fail(`${where}: tapsJson is required`)
}
if (JSON.stringify(ids) !== JSON.stringify([...ids].sort()))
  fail('entries are sorted by id')
if (process.exitCode) process.exit(process.exitCode)

// Every non-built-in manifest fetches, parses, and agrees with its entry.
for (const e of entries.filter((x) => !x.builtin)) {
  let manifest
  try {
    const res = await fetch(e.tapsJson, { signal: AbortSignal.timeout(20000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    manifest = await res.json()
  } catch (error) {
    fail(`${e.id}: could not fetch tapsJson (${error.message})`)
    continue
  }
  if (manifest.id !== e.id) fail(`${e.id}: taps.json id is ${manifest.id}`)
  if (manifest.runtime !== e.runtime)
    fail(`${e.id}: taps.json runtime is ${manifest.runtime}`)
  if (typeof manifest.name !== 'string' || !Array.isArray(manifest.pages) || !manifest.pages.length)
    fail(`${e.id}: taps.json needs a name and at least one page`)
  for (const p of manifest.pages ?? []) {
    if (typeof p?.name !== 'string' || typeof p?.path !== 'string' || !p.path.startsWith('/'))
      fail(`${e.id}: a page needs a name and an absolute path`)
  }
  if (manifest.runtime === 'static' && manifest.start)
    fail(`${e.id}: a static tap takes no start command`)
  if (manifest.runtime !== 'static' && typeof manifest.start !== 'string')
    fail(`${e.id}: this runtime needs a start command`)
}
if (!process.exitCode) console.log(`registry: ${entries.length} entries, all valid`)
