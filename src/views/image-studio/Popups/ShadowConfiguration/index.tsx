'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import useShadowStore from '@views/image-studio/Popups/ShadowConfiguration/store'
import { CloudSunIcon } from 'lucide-react'
import { type FC } from 'react'

import LayerPanel from './wrappers/LayerPanel'
import LinkFocusSection from './wrappers/LinkFocusSection'

const ShadowConfiguration: FC = () => {
  const clearShadows = useShadowStore(s => s.clearShadows)
  const clearLights = useShadowStore(s => s.clearLights)

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Sombras y luz'>
          <CloudSunIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imagen · Sombras y luz
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
        <LinkFocusSection />
        <div className='bg-border/70 h-px w-full' />
        <LayerPanel kind='shadow' />
        <div className='bg-border/70 h-px w-full' />
        <LayerPanel kind='light' />
      </Popup.Content>

      <Popup.Footer>
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={() => {
            clearShadows()
            clearLights()
          }}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default ShadowConfiguration
