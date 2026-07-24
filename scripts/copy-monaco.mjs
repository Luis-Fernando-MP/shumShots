import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules', 'monaco-editor', 'min')
const dest = join(root, 'public', 'monaco', 'min')

if (!existsSync(src)) {
  console.warn('[copy-monaco] monaco-editor min build not found, skip')
  process.exit(0)
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(dirname(dest), { recursive: true })
cpSync(src, dest, { recursive: true })
console.log('[copy-monaco] copied to public/monaco/min')
