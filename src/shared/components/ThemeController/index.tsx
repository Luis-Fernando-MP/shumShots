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
    <Popup title='Temas' className='flex max-h-[600px] max-w-[320px] flex-row flex-wrap gap-1'>
      <Popup.Trigger>
        <Button tooltip='Tema de la aplicación' tooltipPosition='bottom' status='error'>
          <ThemeColorDisplay />
          <span className='text-muted-foreground text-xs'>Tema:</span>
          <span className='text-sm font-medium'>{appTheme}</span>
        </Button>
      </Popup.Trigger>

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
    </Popup>
  )
}

export default ThemeController
