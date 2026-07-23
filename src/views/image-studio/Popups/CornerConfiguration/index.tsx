import Popup from '@/shared/components/Popup'
import IconButton from '@/shared/ui/IconButton'
import { SquareRoundCornerIcon } from 'lucide-react'
import { type FC } from 'react'

import BorderBoxSizingController from './wrappers/BorderBoxSizingController'
import BorderColorsController from './wrappers/BorderColorsController'
import BorderSizeController from './wrappers/BorderSizeController'
import BorderStyleController from './wrappers/BorderStyleController'
import ImagesRadiusController from './wrappers/ImagesRadiusController'

const CornerConfiguration: FC = () => {
  return (
    <Popup title='Imágenes - Border' className='borderConfig-popup flex h-[700px] w-[350px] flex-col gap-grid-xl'>
      <Popup.Trigger>
        <IconButton label='Estilo de borde' transparent>
          <SquareRoundCornerIcon />
        </IconButton>
      </Popup.Trigger>
      <ImagesRadiusController />
      <BorderStyleController />
      <BorderSizeController />
      <BorderBoxSizingController />
      <BorderColorsController />
      {/* TODO: Verificar la efectividad de los gradientes
      <BorderGradientsController /> */}
    </Popup>
  )
}

export default CornerConfiguration
