'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import PaletteSphere from '@/shared/ui/PaletteSphere'
import ThemeColorDisplay from '@/shared/ui/ThemeColorDisplay'
import { type JSX, MouseEvent } from 'react'

import useAppTheme from './useAppTheme'

const ThemeController = (): JSX.Element => {
  const { appTheme, THEMES, handleSetTheme } = useAppTheme()

  const handleSelectTheme = (key: string, e: MouseEvent): void => {
    if (e.ctrlKey) return
    handleSetTheme(key)
  }

  return (
    <Popup>
      <Popup.Trigger>
        <Button tooltip='Tema de la aplicación'>
          <ThemeColorDisplay />
          <span className='text-muted-foreground text-xs'>Tema:</span>
          <span className='text-sm font-medium'>{appTheme}</span>
        </Button>
      </Popup.Trigger>

      <Popup.Header>Temas</Popup.Header>

      <Popup.Content className='flex max-h-[600px] max-w-[320px] flex-row flex-wrap gap-1'>
        {Object.entries(THEMES).map(current => {
          const [key, colors] = current
          return (
            <PaletteSphere
              key={key}
              title={key}
              theme={colors}
              selected={key === appTheme}
              onClick={e => handleSelectTheme(key, e)}
            />
          )
        })}
      </Popup.Content>
    </Popup>
  )
}

export default ThemeController
