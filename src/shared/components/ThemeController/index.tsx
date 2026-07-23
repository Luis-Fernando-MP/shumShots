'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import PaletteSphere from '@/shared/ui/PaletteSphere'
import ThemeColorDisplay from '@/shared/ui/ThemeColorDisplay'
import { type JSX } from 'react'

import useAppTheme from './useAppTheme'

const ThemeController = (): JSX.Element => {
  const { appTheme, THEMES, handleSetTheme } = useAppTheme()

  const handleSelectTheme = (key: string): void => {
    handleSetTheme(key)
  }

  return (
    <Popup>
      <Popup.Trigger>
        <Button>
          <ThemeColorDisplay />

          <span className='text-muted-foreground text-xs'>Tema:</span>
          <span className='text-sm font-semibold'>{appTheme}</span>
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
              onClick={() => handleSelectTheme(key)}
            />
          )
        })}
      </Popup.Content>
    </Popup>
  )
}

export default ThemeController
