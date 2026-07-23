import Popup from '@/shared/components/Popup'
import { PopupPositions } from '@/shared/components/Popup/usePopup'
import IconButton from '@/shared/ui/IconButton'
import { SquareRoundCornerIcon } from 'lucide-react'
import { type FC, MouseEvent, useState } from 'react'

import BorderBoxSizingController from './wrappers/BorderBoxSizingController'
import BorderColorsController from './wrappers/BorderColorsController'
import BorderSizeController from './wrappers/BorderSizeController'
import BorderStyleController from './wrappers/BorderStyleController'
import ImagesRadiusController from './wrappers/ImagesRadiusController'

const CornerConfiguration: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [positions, setPositions] = useState<PopupPositions>()

  const handleOpenPopup = (e: MouseEvent) => {
    setIsOpen(!isOpen)
    setPositions({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <IconButton label='Estilo de borde' transparent onClick={handleOpenPopup}>
        <SquareRoundCornerIcon />
      </IconButton>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        clickPosition={positions}
        title='Imágenes - Border'
        className='borderConfig-popup flex h-[700px] w-[350px] flex-col gap-grid-xl'
      >
        <ImagesRadiusController />
        <BorderStyleController />
        <BorderSizeController />
        <BorderBoxSizingController />
        <BorderColorsController />
        {/* TODO: Verificar la efectividad de los gradientes
        <BorderGradientsController /> */}
      </Popup>
    </>
  )
}

export default CornerConfiguration
