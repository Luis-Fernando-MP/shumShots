'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { LayoutTemplate } from 'lucide-react'
import { type FC } from 'react'

import SetterPixisPreferences from './preferences/SetterPixisPreferences'

const UserPixisPreferences: FC = () => {
  return (
    <Popup className='h-[min(700px,85dvh)] w-[min(100vw-2rem,420px)]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Configurar pixis'>
          <LayoutTemplate />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Pixis config</Popup.Header>

      <Popup.Content className='scrollbar-hidden flex flex-col gap-5'>
        <SetterPixisPreferences />
      </Popup.Content>
    </Popup>
  )
}

export default UserPixisPreferences
