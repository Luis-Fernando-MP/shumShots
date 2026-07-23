import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import monacoLanguagesIcons, { MonacoLanguage } from '@/shared/monaco-languages'
import { StateCreator, create } from 'zustand'

import { defaultShumOptions } from '../defaults/defaultShumOptions'

interface IShumOptionsStore {
  language: MonacoLanguage
  typography: string
  showLanguageIcon: boolean
  shadowLanguage: boolean
  borderRadius: number

  containerWidth: number
  containerHeight: number
  containerPadding: number
  containerBorderRadius: number

  setLanguage: (language: MonacoLanguage) => void
  setTypography: (typography: string) => void
  setShowLanguageIcon: (showLanguageIcon: boolean) => void

  setShadowLanguage: (shadowLanguage: boolean) => void
  setBorderRadius: (borderRadius: number) => void
  setContainerWidth: (containerWidth: number) => void
  setContainerHeight: (containerHeight: number) => void
  setContainerPadding: (containerPadding: number) => void
  setContainerBorderRadius: (containerBorderRadius: number) => void
  resetShumPreferences: () => void
}

const state: StateCreator<IShumOptionsStore> = set => ({
  ...defaultShumOptions,

  setLanguage: language => set({ language }),
  setTypography: typography => set({ typography }),
  setShowLanguageIcon: showLanguageIcon => set({ showLanguageIcon }),

  setShadowLanguage: shadowLanguage => set({ shadowLanguage }),
  setBorderRadius: borderRadius => set({ borderRadius }),
  setContainerWidth: containerWidth => set({ containerWidth }),
  setContainerHeight: containerHeight => set({ containerHeight }),
  setContainerPadding: containerPadding => set({ containerPadding }),
  setContainerBorderRadius: containerBorderRadius => set({ containerBorderRadius }),
  resetShumPreferences: () => set(defaultShumOptions)
})

const useShumOptionsStore = create(state)

export default useShumOptionsStore
