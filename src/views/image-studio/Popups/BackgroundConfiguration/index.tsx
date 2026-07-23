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
    <Popup
      title='Configuration del fondo'
      className='bgConfig-popup flex h-[700px] w-[350px] flex-col gap-grid-xl'
    >
      <Popup.Trigger>
        <Button tooltip='Configuration del fondo'>
          <BlendIcon />
        </Button>
      </Popup.Trigger>
      <RadiusController />
      <BackgroundSizeController />
      <BackgroundColorsController />
      <BackgroundGradientsController />
      <BackgroundUploadController />
    </Popup>
  )
}

export default BackgroundConfiguration
