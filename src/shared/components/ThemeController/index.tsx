'use client'

import Popup from '@/shared/components/Popup'
import IconButton from '@/shared/ui/IconButton'
import PaletteSphere from '@/shared/ui/PaletteSphere'
import ThemeColorDisplay from '@/shared/ui/ThemeColorDisplay'
import { type JSX, MouseEvent, useState } from 'react'

import { PopupPositions } from '../Popup/usePopup'
import useAppTheme from './useAppTheme'

const ThemeController = (): JSX.Element => {
  const [openThemes, setOpenThemes] = useState(false)
  const [positions, setPositions] = useState<PopupPositions>()
  const { appTheme, THEMES, handleSetTheme } = useAppTheme()
  const togglePopup = () => {
    setOpenThemes(!openThemes)
  }

  const handleOpenPopup = (e: MouseEvent): void => {
    if (openThemes) {
      setOpenThemes(false)
      return
    }
    setPositions({ x: e.clientX, y: e.clientY })
    setOpenThemes(true)
  }

  const handleSelectTheme = (key: string, e: MouseEvent): void => {
    if (e.ctrlKey) return
    handleSetTheme(key)
  }

  return (
    <section>
      <IconButton transparent label='Tema de la aplicación' position='bottom' onClick={handleOpenPopup}>
        <ThemeColorDisplay />
        <span className='text-xs text-muted-foreground'>Tema:</span>
        <span className='text-sm font-medium'>{appTheme}</span>
      </IconButton>
      <Popup isOpen={openThemes} onClose={togglePopup} title='Temas' className='flex max-h-[600px] max-w-[320px] flex-row flex-wrap gap-1' clickPosition={positions}>
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
    </section>
  )
}

export default ThemeController
