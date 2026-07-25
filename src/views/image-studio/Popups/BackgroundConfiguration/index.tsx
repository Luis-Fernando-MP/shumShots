'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { BlendIcon } from 'lucide-react'
import { type FC } from 'react'

import BackgroundBlurController from './wrappers/BackgroundBlurController'
import BackgroundColorsController from './wrappers/BackgroundColorsController'
import BackgroundGradientsController from './wrappers/BackgroundGradientsController'
import BackgroundOverlayController from './wrappers/BackgroundOverlayController'
import BackgroundPositionController from './wrappers/BackgroundPositionController'
import BackgroundSizeController from './wrappers/BackgroundSizeController'
import BackgroundUploadController from './wrappers/BackgroundUploadController'
import BackgroundWallpapersController from './wrappers/BackgroundWallpapersController'
import RadiusController from './wrappers/RadiusController'

const BackgroundConfiguration: FC = () => {
  return (
    <Popup className='h-[700px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Configuración del fondo'>
          <BlendIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Configuración del fondo</Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col'>
        <RadiusController />
        <BackgroundSizeController />
        <BackgroundColorsController />
        <BackgroundGradientsController />
        <BackgroundWallpapersController />
        <BackgroundUploadController />
        <BackgroundPositionController />
        <BackgroundOverlayController />
        <BackgroundBlurController />
      </Popup.Content>
    </Popup>
  )
}

export default BackgroundConfiguration
