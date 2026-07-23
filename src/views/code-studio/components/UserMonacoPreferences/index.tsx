'use client'

import Popup from '@/shared/components/Popup'
import SliceContainer from '@/shared/components/SliceContainer'
import Button from '@/shared/ui/Button'
import Typography from '@common/ui/Typography'
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
        <Button size='icon' tooltip='Configurar monaco'>
          <Settings />
        </Button>
      </Popup.Trigger>
      <Popup.Header>Monaco config</Popup.Header>
      <Popup.Content className='flex flex-col gap-grid-xl'>
        <Typography.Block title='Temas:' className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <SliceContainer
            maxHeight={100}
            extendedMaxHeight={500}
            className='monacoPreferences-themes flex w-full flex-row flex-wrap gap-grid-sm'
          >
            <ThemeSelectorPreference />
          </SliceContainer>
        </Typography.Block>

        <Typography.Block title='Lenguajes de Programación:' className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <SliceContainer
            maxHeight={130}
            extendedMaxHeight={500}
            className='monacoPreferences-languages flex w-full flex-col'
          >
            <MonacoLanguages />
          </SliceContainer>
        </Typography.Block>

        <Typography.Block title='Tipografía:' className='monacoPreferences-section flex flex-col gap-grid-lg'>
          <SliceContainer
            maxHeight={130}
            extendedMaxHeight={500}
            className='monacoPreferences-fonts flex w-full flex-row flex-wrap gap-grid-sm'
          >
            <MonacoFonts />
          </SliceContainer>
        </Typography.Block>

        <SetterMonacoPreferences />
      </Popup.Content>
    </Popup>
  )
}

export default UserMonacoPreferences
