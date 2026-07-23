import { ThemeMonacoName, monacoThemes } from '@/shared/themes/monacoThemes'
import { ThemeColors } from '@/shared/themes/monacoThemes.type'
import PaletteSphere from '@/shared/ui/PaletteSphere'
import type { FC } from 'react'

import useMonacoThemeStore from '../../store/monacoTheme.store'

const ThemeSelectorPreference: FC = () => {
  const { themeName, setThemeName } = useMonacoThemeStore()

  return (
    <>
      {Object.values(monacoThemes).map(theme => {
        const { name } = theme
        const colors = theme.colors as ThemeColors
        return (
          <PaletteSphere
            key={name}
            title={name}
            selected={name === themeName}
            onClick={() => setThemeName(name as ThemeMonacoName)}
            theme={{
              'tn-primary': colors['editor.foreground'],
              'tn-secondary':
                colors['activityBarBadge.background'] ??
                colors['editor.selectionBackground'] ??
                colors['editor.selectionHighlightBackground'],
              'bg-primary': colors['editor.background']
            }}
          />
        )
      })}
    </>
  )
}

export default ThemeSelectorPreference
