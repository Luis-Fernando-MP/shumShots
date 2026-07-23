import Popup from '@/shared/components/Popup'
import { PopupPositions } from '@/shared/components/Popup/usePopup'
import IconButton from '@/shared/ui/IconButton'
import { BlendIcon } from 'lucide-react'
import { type FC, MouseEvent, useState } from 'react'

import BackgroundColorsController from './wrappers/BackgroundColorsController'
import BackgroundGradientsController from './wrappers/BackgroundGradientsController'
import BackgroundSizeController from './wrappers/BackgroundSizeController'
import BackgroundUploadController from './wrappers/BackgroundUploadController'
import RadiusController from './wrappers/RadiusController'

const BackgroundConfiguration: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [positions, setPositions] = useState<PopupPositions>()

  const handleOpenPopup = (e: MouseEvent) => {
    setIsOpen(!isOpen)
    setPositions({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <IconButton label='Configuration del fondo' transparent onClick={handleOpenPopup}>
        <BlendIcon />
      </IconButton>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        clickPosition={positions}
        title='Configuration del fondo'
        className='bgConfig-popup flex h-[700px] w-[350px] flex-col gap-grid-xl'
      >
        <RadiusController />
        <BackgroundSizeController />
        <BackgroundColorsController />
        <BackgroundGradientsController />
        <BackgroundUploadController />
      </Popup>
    </>
  )
}

export default BackgroundConfiguration
