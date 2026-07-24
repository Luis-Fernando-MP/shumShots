import { ThemeMonacoName, monacoThemes } from '@/shared/themes/monacoThemes'
import PaletteSphere from '@/shared/ui/PaletteSphere'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import type { FC } from 'react'

const PALETTE_KEYS = {
  'tn-primary': 'editor.foreground',
  'tn-secondary': 'activityBarBadge.background',
  'bg-primary': 'editor.background'
} as const

const PALETTE_FALLBACK = {
  'tn-primary': '#888888',
  'tn-secondary': '#666666',
  'bg-primary': '#1e1e1e'
} as const

const toPaletteTheme = (colors: Record<string, string | undefined>) => ({
  'tn-primary': colors[PALETTE_KEYS['tn-primary']] ?? PALETTE_FALLBACK['tn-primary'],
  'tn-secondary': colors[PALETTE_KEYS['tn-secondary']] ?? PALETTE_FALLBACK['tn-secondary'],
  'bg-primary': colors[PALETTE_KEYS['bg-primary']] ?? PALETTE_FALLBACK['bg-primary']
})

const ThemeSelectorPreference: FC = () => {
  const { themeName, setThemeName } = useMonacoThemeStore()

  return (
    <>
      {Object.values(monacoThemes).map(theme => (
        <PaletteSphere
          key={theme.name}
          title={theme.name}
          selected={theme.name === themeName}
          onClick={() => setThemeName(theme.name as ThemeMonacoName)}
          theme={toPaletteTheme(theme.colors)}
        />
      ))}
    </>
  )
}

export default ThemeSelectorPreference
