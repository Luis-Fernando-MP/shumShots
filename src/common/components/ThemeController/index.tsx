'use client'

import { FEATURED_THEME_KEYS, type Theme, isLightTheme } from '@app/defaults/themes'
import Button from '@common/components/Button'
import PaletteSphere from '@common/components/PaletteSphere'
import Popup from '@common/components/Popup'
import Separator from '@common/components/Separator'
import ThemeColorDisplay from '@common/components/ThemeColorDisplay'
import { type FC, type JSX } from 'react'

import useAppTheme from './useAppTheme'

const ThemeGroup = ({
  label,
  entries,
  appTheme,
  onSelect
}: {
  label: string
  entries: [string, Theme][]
  appTheme: string
  onSelect: (key: string) => void
}): JSX.Element | null => {
  if (entries.length === 0) return null

  return (
    <section className='gap-grid-sm flex flex-col'>
      <h6 className='text-muted-foreground px-1 text-[11px] font-medium tracking-wide uppercase'>{label}</h6>
      <div className='grid grid-cols-2 gap-1'>
        {entries.map(([key, colors]) => (
          <PaletteSphere
            key={key}
            title={key}
            theme={colors}
            selected={key === appTheme}
            onClick={() => onSelect(key)}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * Selector de paleta de la consola PIXIS.
 *
 * Agrupa Geist Light/Dark (estilo Vercel) al frente y el resto por
 * claros / oscuros. Al elegir un tema reescribe los tokens `--*` del `<html>`.
 *
 * @returns Trigger del header con el tema activo y el popup de paletas.
 */
const ThemeController: FC = () => {
  const { appTheme, THEMES, handleSetTheme } = useAppTheme()

  const featured = FEATURED_THEME_KEYS.flatMap(key => {
    const theme = THEMES[key]
    if (!theme) return []
    return [[key, theme] as [string, Theme]]
  })

  const rest = Object.entries(THEMES).filter(([key]) => !FEATURED_THEME_KEYS.includes(key as (typeof FEATURED_THEME_KEYS)[number]))
  const light = rest.filter(([, theme]) => isLightTheme(theme))
  const dark = rest.filter(([, theme]) => !isLightTheme(theme))

  return (
    <Popup className='h-[640px] w-[360px]'>
      <Popup.Trigger>
        <Button variant='ghost' tooltip='Cambiar tema de la consola'>
          <ThemeColorDisplay />
          <span className='text-muted-foreground text-sm'>Tema</span>
          <span className='text-sm font-semibold'>{appTheme}</span>
        </Button>
      </Popup.Trigger>

      <Popup.Header>Temas</Popup.Header>

      <Popup.Content className='gap-grid flex flex-col'>
        <ThemeGroup label='Principales' entries={featured} appTheme={appTheme} onSelect={handleSetTheme} />
        <Separator orientation='horizontal' />
        <ThemeGroup label='Claros' entries={light} appTheme={appTheme} onSelect={handleSetTheme} />
        <Separator orientation='horizontal' />
        <ThemeGroup label='Oscuros' entries={dark} appTheme={appTheme} onSelect={handleSetTheme} />
      </Popup.Content>
    </Popup>
  )
}

export default ThemeController
