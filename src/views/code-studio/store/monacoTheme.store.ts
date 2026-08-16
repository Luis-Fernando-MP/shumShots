import { ThemeMonacoName, monacoThemes } from '@common/components/monaco/themes/monacoThemes'
import { ThemeMonaco } from '@common/components/monaco/themes/monacoThemes.type'
import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IMonacoThemeStore {
  themeName: ThemeMonacoName
  setThemeName: (themeName: ThemeMonacoName) => void
  getCurrentTheme: () => ThemeMonaco
  resetTheme: () => void
}

const defaultThemeName = 'vs-light'

const state: StateCreator<IMonacoThemeStore> = (set, get) => ({
  themeName: defaultThemeName,
  setThemeName: themeName => set({ themeName }),
  getCurrentTheme: () => {
    const { themeName } = get()
    return monacoThemes[themeName] as any as ThemeMonaco
  },
  resetTheme: () => set({ themeName: defaultThemeName })
})

const useMonacoThemeStore = create(persist(state, { name: 'monacoTheme' }))

export default useMonacoThemeStore
