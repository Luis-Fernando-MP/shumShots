'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Typography from '@common/ui/Typography'
import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import { CloudSunIcon } from 'lucide-react'
import { type FC } from 'react'

import LightColorsWrapper from './wrappers/LightColorsWrapper'
import LightFocusPad from './wrappers/LightFocusPad'
import LightOpacityWrapper from './wrappers/LightOpacityWrapper'
import LightPresetsWrapper from './wrappers/LightPresetsWrapper'
import ShadowColorsWrapper from './wrappers/ShadowColorsWrapper'
import ShadowFocusPad from './wrappers/ShadowFocusPad'
import ShadowOpacityWrapper from './wrappers/ShadowOpacityWrapper'
import ShadowPresetsWrapper from './wrappers/ShadowPresetsWrapper'

const ShadowConfiguration: FC = () => {
  const applyPreset = useShadowStore(s => s.applyPreset)
  const applyLightPreset = useShadowStore(s => s.applyLightPreset)

  return (
    <Popup className='h-[780px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Sombras y luz'>
          <CloudSunIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>Imagen · Sombras y luz</h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'>
        <div className='gap-grid-xl flex flex-col'>
          <Typography.Label size='xs' weight='semibold' className='text-muted-foreground tracking-wide'>
            # Sombra
          </Typography.Label>
          <ShadowPresetsWrapper />
          <ShadowFocusPad />
          <ShadowOpacityWrapper />
          <ShadowColorsWrapper />
        </div>

        <div className='bg-border h-px w-full' />

        <div className='gap-grid-xl flex flex-col'>
          <Typography.Label size='xs' weight='semibold' className='text-muted-foreground tracking-wide'>
            # Luz
          </Typography.Label>
          <LightPresetsWrapper />
          <LightFocusPad />
          <LightOpacityWrapper />
          <LightColorsWrapper />
        </div>
      </Popup.Content>

      <Popup.Footer className='gap-2'>
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={() => applyPreset('none')}>
          Quitar sombra
        </UiButton>
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={() => applyLightPreset('none')}
        >
          Quitar luz
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default ShadowConfiguration
