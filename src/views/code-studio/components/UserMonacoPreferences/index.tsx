'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Separator } from '@common/ui/Separator'
import SliceContainer from '@common/ui/SliceContainer'
import Typography from '@common/ui/Typography'
import { Settings } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

import MonacoLanguages from '../MonacoLanguages'
import ThemeSelectorPreference from './ThemeSelectorPreference'
import MonacoFonts from './preferences/MonacoFonts'
import SetterMonacoPreferences from './preferences/SetterMonacoPreferences'

const Section = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <Typography.Block title={title} className='gap-2.5'>
    <Typography.Paragraph tone='secondary' className='m-0 -mt-0.5 leading-snug'>
      {subtitle}
    </Typography.Paragraph>
    {children}
  </Typography.Block>
)

const UserMonacoPreferences: FC = () => {
  return (
    <Popup className='h-[min(700px,85dvh)] w-[min(100vw-2rem,420px)]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Configurar monaco'>
          <Settings />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Monaco config</Popup.Header>

      <Popup.Content className='scrollbar-hidden flex flex-col gap-5'>
        <Section title='Temas:' subtitle='Paleta de sintaxis del editor.'>
          <SliceContainer maxHeight={112} extendedMaxHeight={480} className='grid w-full grid-cols-3 flex-row flex-wrap gap-1.5'>
            <ThemeSelectorPreference />
          </SliceContainer>
        </Section>

        <Separator orientation='horizontal' className='opacity-60' />

        <Section title='Lenguajes de Programación:' subtitle='Icono y modo de resaltado del shot.'>
          <SliceContainer maxHeight={140} extendedMaxHeight={480} className='flex w-full flex-col gap-3'>
            <MonacoLanguages />
          </SliceContainer>
        </Section>

        <Separator orientation='horizontal' className='opacity-60' />

        <Section title='Tipografía:' subtitle='Familia tipográfica del código.'>
          <SliceContainer maxHeight={160} extendedMaxHeight={520} className='w-full'>
            <MonacoFonts />
          </SliceContainer>
        </Section>

        <Separator orientation='horizontal' className='opacity-60' />

        <SetterMonacoPreferences />
      </Popup.Content>
    </Popup>
  )
}

export default UserMonacoPreferences
