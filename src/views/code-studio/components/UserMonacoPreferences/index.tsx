'use client'

import Popup from '@/shared/components/Popup'
import { PopupPositions } from '@/shared/components/Popup/usePopup'
import SliceContainer from '@/shared/components/SliceContainer'
import IconButton from '@/shared/ui/IconButton'
import { Settings } from 'lucide-react'
import { type FC, MouseEvent, useState } from 'react'

import MonacoLanguages from '../MonacoLanguages'
import MonacoFonts from './MonacoFonts'
import SetterMonacoPreferences from './SetterMonacoPreferences'
import ThemeSelectorPreference from './ThemeSelectorPreference'

const UserMonacoPreferences: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [positions, setPositions] = useState<PopupPositions>()

  const handleOpenPopup = (e: MouseEvent) => {
    setIsOpen(!isOpen)
    setPositions({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <IconButton label='Configurar monaco' transparent onClick={handleOpenPopup}>
        <Settings />
      </IconButton>

      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        clickPosition={positions}
        title='Monaco config'
        className='monacoPreferences-popup flex h-[700px] max-h-[700px] w-[400px] flex-col gap-grid-xl'
      >
        <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <div className='paragraph'>
            <h3 className='paragraph-highlight'># Temas:</h3>
          </div>
          <SliceContainer maxHeight={100} extendedMaxHeight={500} className='monacoPreferences-themes flex w-full flex-row flex-wrap gap-grid-sm'>
            <ThemeSelectorPreference />
          </SliceContainer>
        </div>

        <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <div className='paragraph'>
            <h3 className='paragraph-highlight'># Lenguajes de Programación:</h3>
          </div>

          <SliceContainer maxHeight={130} extendedMaxHeight={500} className='monacoPreferences-languages flex w-full flex-col'>
            <MonacoLanguages />
          </SliceContainer>
        </div>

        <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <div className='paragraph'>
            <h3 className='paragraph-highlight'># Tipografía:</h3>
          </div>

          <SliceContainer maxHeight={130} extendedMaxHeight={500} className='monacoPreferences-fonts flex w-full flex-row flex-wrap gap-grid-sm'>
            <MonacoFonts />
          </SliceContainer>
        </div>
        <SetterMonacoPreferences />
      </Popup>
    </>
  )
}

export default UserMonacoPreferences
