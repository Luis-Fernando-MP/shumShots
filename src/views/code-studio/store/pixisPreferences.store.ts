import { resolveLanguageMeta, resolveMonacoFontId } from '@common/monaco'
import { getDefaultMonacoState } from '@views/code-studio/components/UserMonacoPreferences/utils'
import {
  applyPixisDom,
  chromeDefaults,
  clampSize,
  heightFromWidth,
  isAspectLocked,
  widthFromHeight
} from '@views/code-studio/components/UserPixisPreferences/utils'
import {
  type MonacoState,
  type PixisChromeState,
  type PixisState,
  type PreferencesState,
  getDefaultState
} from '@views/code-studio/utils/preferences'
import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type MonacoLanguage } from '@/shared/monaco-languages'

type PixisKey = keyof PixisState
type MonacoKey = keyof MonacoState

interface PixisPreferencesActions {
  setLanguage: (language: MonacoLanguage) => void
  setTypography: (typography: string) => void
  setPixis: <K extends PixisKey>(key: K, value: PixisState[K]) => void
  setMonaco: <K extends MonacoKey>(key: K, value: MonacoState[K]) => void
  patchPixis: (partial: Partial<PixisState>) => void
  patchChrome: (partial: Partial<PixisChromeState>) => void
  resetPixis: () => void
  resetMonaco: () => void
  resetPreferences: () => void
}

export type PixisPreferencesStore = PreferencesState & PixisPreferencesActions

type PersistedPreferences = {
  pixis: Omit<PixisState, 'language'> & {
    language: Pick<MonacoLanguage, 'language' | 'short'>
  }
  monaco: MonacoState
}

const PREFERENCES_STORAGE_KEY = 'code-studio-preferences'
const PREFERENCES_VERSION = 1

const applyPixisDomPatch = (key: PixisKey, value: PixisState[PixisKey], state: PixisState) => {
  const next = { ...state, [key]: value }
  const $editor = document.querySelector('#monacoEditor') as HTMLElement | null
  const $container = document.querySelector('#monacoEditor-container') as HTMLElement | null

  if ($editor) {
    if (key === 'borderRadius') $editor.style.borderRadius = `${value as number}px`
    if (key === 'containerWidth') $editor.style.width = `${value as number}px`
    if (key === 'containerHeight') $editor.style.height = `${value as number}px`
  }
  if ($container) {
    if (key === 'containerBorderRadius') $container.style.borderRadius = `${value as number}px`
    if (key === 'containerPadding') $container.style.padding = `${value as number}px`
  }

  return next
}

const resolvePixisSize = (
  key: PixisKey,
  value: PixisState[PixisKey],
  state: PixisState
): PixisState => {
  if (key !== 'containerWidth' && key !== 'containerHeight') {
    return applyPixisDomPatch(key, value, state)
  }

  const size = clampSize(Number(value))
  if (!isAspectLocked(state.aspectRatio)) {
    return applyPixisDomPatch(key, size, state)
  }

  if (key === 'containerWidth') {
    const height = heightFromWidth(size, state.aspectRatio)
    if (height != null) {
      const next = { ...state, containerWidth: size, containerHeight: height }
      applyPixisDom(next)
      return next
    }
  }

  if (key === 'containerHeight') {
    const width = widthFromHeight(size, state.aspectRatio)
    if (width != null) {
      const next = { ...state, containerWidth: width, containerHeight: size }
      applyPixisDom(next)
      return next
    }
  }

  return applyPixisDomPatch(key, size, state)
}

const mergeMonaco = (persisted?: Partial<MonacoState>): MonacoState => {
  const defaults = getDefaultMonacoState()
  if (!persisted) return defaults

  const persistedHighlight = persisted.highlightLines as
    | (Partial<MonacoState['highlightLines']> & { diffMode?: string; diffOriginal?: string })
    | undefined

  const legacyDiff = persistedHighlight?.diffMode
  const migratedDiffView =
    persistedHighlight?.diffView ??
    (legacyDiff === 'sideBySide' || legacyDiff === 'inline' ? legacyDiff : defaults.highlightLines.diffView)

  const highlightSource = persistedHighlight ?? {}
  const highlightRest = Object.fromEntries(
    Object.entries(highlightSource).filter(
      ([key]) => key !== 'diffMode' && key !== 'diffOriginal'
    )
  ) as Partial<MonacoState['highlightLines']>

  return {
    ...defaults,
    ...persisted,
    minimap: { ...defaults.minimap, ...persisted.minimap },
    scrollbar: { ...defaults.scrollbar, ...persisted.scrollbar },
    stickyScroll: { ...defaults.stickyScroll, ...persisted.stickyScroll },
    highlightLines: {
      ...defaults.highlightLines,
      ...highlightRest,
      diffView: migratedDiffView
    }
  }
}

const mergePixis = (persisted?: Partial<PersistedPreferences['pixis']>): PixisState => {
  const defaults = getDefaultState().pixis
  if (!persisted) return defaults

  const next = {
    ...defaults,
    ...persisted,
    chrome: { ...chromeDefaults, ...persisted.chrome },
    language: resolveLanguageMeta(persisted.language),
    typography: resolveMonacoFontId(persisted.typography),
    exportScale: Math.min(10, Math.max(4, Math.round(persisted.exportScale ?? defaults.exportScale)))
  } as PixisState & { showLanguageIcon?: boolean; shadowLanguage?: boolean }

  delete next.showLanguageIcon
  delete next.shadowLanguage
  return next
}

const state: StateCreator<PixisPreferencesStore> = set => ({
  ...getDefaultState(),

  setLanguage: language => set(s => ({ pixis: { ...s.pixis, language } })),
  setTypography: typography => set(s => ({ pixis: { ...s.pixis, typography } })),

  setPixis: (key, value) => set(s => ({ pixis: resolvePixisSize(key, value, s.pixis) })),

  setMonaco: (key, value) =>
    set(s => ({
      monaco: { ...s.monaco, [key]: value }
    })),

  patchPixis: partial =>
    set(s => {
      const pixis = { ...s.pixis, ...partial }
      if (
        partial.borderRadius != null ||
        partial.containerWidth != null ||
        partial.containerHeight != null ||
        partial.containerBorderRadius != null ||
        partial.containerPadding != null
      ) {
        applyPixisDom(pixis)
      }
      return { pixis }
    }),

  patchChrome: partial =>
    set(s => ({
      pixis: {
        ...s.pixis,
        chrome: { ...s.pixis.chrome, ...partial }
      }
    })),

  resetPixis: () => {
    const pixis = getDefaultState().pixis
    set({ pixis })
    applyPixisDom(pixis)
  },

  resetMonaco: () => {
    set({ monaco: getDefaultState().monaco })
  },

  resetPreferences: () => {
    const defaults = getDefaultState()
    set(defaults)
    applyPixisDom(defaults.pixis)
  }
})

const usePixisPreferencesStore = create(
  persist(state, {
    name: PREFERENCES_STORAGE_KEY,
    version: PREFERENCES_VERSION,
    partialize: (s): PersistedPreferences => ({
      pixis: {
        ...s.pixis,
        language: {
          language: s.pixis.language.language,
          short: s.pixis.language.short
        }
      },
      monaco: s.monaco
    }),
    merge: (persisted, current) => {
      const data = persisted as PersistedPreferences | undefined
      return {
        ...current,
        pixis: mergePixis(data?.pixis),
        monaco: mergeMonaco(data?.monaco)
      }
    },
    onRehydrateStorage: () => state => {
      if (state?.pixis) applyPixisDom(state.pixis)
    }
  })
)

export default usePixisPreferencesStore
