'use client'

import Popup from '@/shared/components/Popup'
import SliceContainer from '@/shared/components/SliceContainer'
import Button from '@/shared/ui/Button'
import { Settings } from 'lucide-react'
import { type FC } from 'react'

import MonacoLanguages from '../MonacoLanguages'
import MonacoFonts from './MonacoFonts'
import SetterMonacoPreferences from './SetterMonacoPreferences'
import ThemeSelectorPreference from './ThemeSelectorPreference'

const UserMonacoPreferences: FC = () => {
  return (
    <Popup className='monacoPreferences-popup h-[700px] max-h-[700px] w-[400px]'>
      <Popup.Trigger>
        <Button tooltip='Configurar monaco'>
          <Settings />
        </Button>
      </Popup.Trigger>
      <Popup.Header>Monaco config</Popup.Header>
      <Popup.Content className='flex flex-col gap-grid-xl'>
        <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <div className='paragraph'>
            <h3 className='paragraph-highlight'># Temas:</h3>
          </div>
          <SliceContainer
            maxHeight={100}
            extendedMaxHeight={500}
            className='monacoPreferences-themes flex w-full flex-row flex-wrap gap-grid-sm'
          >
            <ThemeSelectorPreference />
          </SliceContainer>
        </div>

        <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <div className='paragraph'>
            <h3 className='paragraph-highlight'># Lenguajes de Programación:</h3>
          </div>

          <SliceContainer
            maxHeight={130}
            extendedMaxHeight={500}
            className='monacoPreferences-languages flex w-full flex-col'
          >
            <MonacoLanguages />
          </SliceContainer>
        </div>

        <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <div className='paragraph'>
            <h3 className='paragraph-highlight'># Tipografía:</h3>
          </div>

          <SliceContainer
            maxHeight={130}
            extendedMaxHeight={500}
            className='monacoPreferences-fonts flex w-full flex-row flex-wrap gap-grid-sm'
          >
            <MonacoFonts />
          </SliceContainer>
        </div>
        <SetterMonacoPreferences />
      </Popup.Content>
    </Popup>
  )
}

export default UserMonacoPreferences
