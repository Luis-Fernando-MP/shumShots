import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { SquareRoundCornerIcon } from 'lucide-react'
import { type FC } from 'react'

import BorderBoxSizingController from './wrappers/BorderBoxSizingController'
import BorderColorsController from './wrappers/BorderColorsController'
import BorderSizeController from './wrappers/BorderSizeController'
import BorderStyleController from './wrappers/BorderStyleController'
import ImagesRadiusController from './wrappers/ImagesRadiusController'

const CornerConfiguration: FC = () => {
  return (
    <Popup className='borderConfig-popup h-[700px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Estilo de borde'>
          <SquareRoundCornerIcon />
        </Button>
      </Popup.Trigger>
      <Popup.Header>Imágenes - Border</Popup.Header>
      <Popup.Content className='flex flex-col gap-grid-xl'>
        <ImagesRadiusController />
        <BorderStyleController />
        <BorderSizeController />
        <BorderBoxSizingController />
        <BorderColorsController />
        {/* TODO: Verificar la efectividad de los gradientes
        <BorderGradientsController /> */}
      </Popup.Content>
    </Popup>
  )
}

export default CornerConfiguration
