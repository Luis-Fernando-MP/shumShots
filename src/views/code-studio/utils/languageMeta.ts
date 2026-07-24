import monacoLanguagesIcons, { type MonacoLanguage } from '@/shared/monaco-languages'

const DOCKERFILE_NAMES = new Set(['dockerfile', 'containerfile'])

const languageByShort = (() => {
  const map = new Map<string, MonacoLanguage>()
  for (const group of Object.values(monacoLanguagesIcons)) {
    for (const lang of Object.values(group)) {
      map.set(lang.short.toLowerCase(), lang)
      map.set(lang.language.toLowerCase(), lang)
    }
  }
  const ts = map.get('ts') ?? map.get('typescript')
  const js = map.get('js') ?? map.get('javascript')
  if (ts) map.set('tsx', ts)
  if (js) {
    map.set('jsx', js)
    map.set('mjs', js)
    map.set('cjs', js)
  }
  return map
})()

const isDockerfileName = (fileName: string) => {
  const base = fileName.trim().toLowerCase()
  if (DOCKERFILE_NAMES.has(base)) return true
  const [stem] = base.split('.')
  return DOCKERFILE_NAMES.has(stem)
}

export const getLanguageMetaFromFileName = (fileName: string): MonacoLanguage | null => {
  if (isDockerfileName(fileName)) {
    return languageByShort.get('dockerfile') ?? null
  }

  const ext = fileName.includes('.')
    ? fileName.split('.').pop()?.toLowerCase()
    : null
  if (!ext) return null
  return languageByShort.get(ext) ?? null
}

export const languageIdFromFileName = (fileName: string, fallback = 'typescript') =>
  getLanguageMetaFromFileName(fileName)?.language ?? fallback

export const resolveLanguageMeta = (
  partial?: Pick<MonacoLanguage, 'language' | 'short'> | null
): MonacoLanguage => {
  if (partial?.short) {
    const byShort = languageByShort.get(partial.short.toLowerCase())
    if (byShort) return byShort
  }
  if (partial?.language) {
    const byLang = languageByShort.get(partial.language.toLowerCase())
    if (byLang) return byLang
  }
  return languageByShort.get('typescript') ?? monacoLanguagesIcons['Frontend Web'].typescript
}

export const replaceFileExtension = (fileName: string, short: string) => {
  if (short === 'dockerfile') return 'Dockerfile'

  const trimmed = fileName.trim()
  const base = trimmed.includes('.') ? trimmed.replace(/\.[^.]+$/, '') : trimmed
  return `${base || 'untitled'}.${short}`
}
