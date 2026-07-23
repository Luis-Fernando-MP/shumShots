import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { BlendIcon } from 'lucide-react'
import { type FC } from 'react'

import BackgroundColorsController from './wrappers/BackgroundColorsController'
import BackgroundGradientsController from './wrappers/BackgroundGradientsController'
import BackgroundSizeController from './wrappers/BackgroundSizeController'
import BackgroundUploadController from './wrappers/BackgroundUploadController'
import RadiusController from './wrappers/RadiusController'

const BackgroundConfiguration: FC = () => {
  return (
    <Popup className='bgConfig-popup h-[700px] w-[350px]'>
      <Popup.Trigger>
        <Button tooltip='Configuration del fondo'>
          <BlendIcon />
        </Button>
      </Popup.Trigger>
      <Popup.Header>Configuration del fondo</Popup.Header>
      <Popup.Content className='flex flex-col gap-grid-xl'>
        <RadiusController />
        <BackgroundSizeController />
        <BackgroundColorsController />
        <BackgroundGradientsController />
        <BackgroundUploadController />
      </Popup.Content>
    </Popup>
  )
}

export default BackgroundConfiguration
