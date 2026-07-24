import { type MonacoLanguage } from '@/shared/monaco-languages'
import { StateCreator, create } from 'zustand'

import {
  clampSize,
  heightFromWidth,
  isAspectLocked,
  widthFromHeight
} from '../utils/aspectRatio'
import {
  type MonacoState,
  type PixisState,
  type PreferencesState,
  applyPixisDom,
  getDefaultState
} from '../utils/preferences.config'

type PixisKey = keyof PixisState
type MonacoKey = keyof MonacoState

interface PixisPreferencesActions {
  setLanguage: (language: MonacoLanguage) => void
  setTypography: (typography: string) => void
  setPixis: <K extends PixisKey>(key: K, value: PixisState[K]) => void
  setMonaco: <K extends MonacoKey>(key: K, value: MonacoState[K]) => void
  patchPixis: (partial: Partial<PixisState>) => void
  patchMonaco: (partial: Partial<MonacoState>) => void
  resetPreferences: () => void
}

export type PixisPreferencesStore = PreferencesState & PixisPreferencesActions

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

const resolvePixisSize = (key: PixisKey, value: PixisState[PixisKey], state: PixisState): PixisState => {
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

  patchMonaco: partial =>
    set(s => ({
      monaco: { ...s.monaco, ...partial }
    })),

  resetPreferences: () => {
    const defaults = getDefaultState()
    set(defaults)
    applyPixisDom(defaults.pixis)
  }
})

const usePixisPreferencesStore = create(state)

export default usePixisPreferencesStore
