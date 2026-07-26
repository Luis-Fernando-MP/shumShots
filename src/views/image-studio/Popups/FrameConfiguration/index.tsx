'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import useFrameStore from '@views/image-studio/Popups/FrameConfiguration/store'
import { SmartphoneIcon } from 'lucide-react'
import { type FC } from 'react'

import DeviceFramesSection from './wrappers/DeviceFramesSection'
import FitModeSection from './wrappers/FitModeSection'
import SlotPanSection from './wrappers/SlotPanSection'

const FrameConfiguration: FC = () => {
  const reset = useFrameStore(s => s.reset)

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Frames de dispositivo'>
          <SmartphoneIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imagen · Frames
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
        <DeviceFramesSection />
        <div className='bg-border/70 h-px w-full' />
        <FitModeSection />
        <div className='bg-border/70 h-px w-full' />
        <SlotPanSection />
      </Popup.Content>

      <Popup.Footer>
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={reset}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default FrameConfiguration
