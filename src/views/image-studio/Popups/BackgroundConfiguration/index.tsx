'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { BlendIcon } from 'lucide-react'
import { type FC } from 'react'

import BackgroundBlurController from './wrappers/BackgroundBlurController'
import BackgroundColorsController from './wrappers/BackgroundColorsController'
import BackgroundDuotoneController from './wrappers/BackgroundDuotoneController'
import BackgroundFiltersController from './wrappers/BackgroundFiltersController'
import BackgroundGradientsController from './wrappers/BackgroundGradientsController'
import BackgroundOverlayController from './wrappers/BackgroundOverlayController'
import BackgroundPositionController from './wrappers/BackgroundPositionController'
import BackgroundRotationController from './wrappers/BackgroundRotationController'
import BackgroundScaleController from './wrappers/BackgroundScaleController'
import BackgroundSizeController from './wrappers/BackgroundSizeController'
import BackgroundUploadController from './wrappers/BackgroundUploadController'
import BackgroundVignetteController from './wrappers/BackgroundVignetteController'
import BackgroundWallpapersController from './wrappers/BackgroundWallpapersController'

const BackgroundConfiguration: FC = () => {
  const resetBackground = useBackgroundStore(s => s.resetBackground)

  return (
    <Popup className='h-[700px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Configuración del fondo'>
          <BlendIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>Configuración del fondo</h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'>
        <BackgroundSizeController />
        <BackgroundColorsController />
        <BackgroundGradientsController />
        <BackgroundWallpapersController />
        <BackgroundUploadController />
        <BackgroundPositionController />
        <BackgroundScaleController />
        <BackgroundRotationController />
        <BackgroundOverlayController />
        <BackgroundBlurController />
        <BackgroundDuotoneController />
        <BackgroundFiltersController />
        <BackgroundVignetteController />
      </Popup.Content>

      <Popup.Footer>
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={resetBackground}>
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default BackgroundConfiguration
