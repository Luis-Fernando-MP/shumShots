import Popup from '@/shared/components/Popup'
import { PopupPositions } from '@/shared/components/Popup/usePopup'
import { newKey } from '@/shared/key'
import IconButton from '@/shared/ui/IconButton'
import { LayoutDashboardIcon } from 'lucide-react'
import { type FC, MouseEvent, useState } from 'react'

import useImagesLayoutStore from '../../store/images/imagesLayout.store'

const layoutOptions = ['grid', 'rose', 'default', 'circle']

const LayoutConfiguration: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [positions, setPositions] = useState<PopupPositions>()
  const { setCurrentLayout, setLayoutCounter, currentLayout, layoutCounter } = useImagesLayoutStore()

  const handleOpenPopup = (e: MouseEvent) => {
    setIsOpen(!isOpen)
    setPositions({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <IconButton label='Sombras' transparent onClick={handleOpenPopup}>
        <LayoutDashboardIcon />
      </IconButton>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        clickPosition={positions}
        title='Imágenes - Sombras'
        className='shadowConfig-popup'
      >
        <h3># Tipo de layout</h3>
        <div className='layout-options'>
          {layoutOptions.map(layout => (
            <button
              key={newKey()}
              onClick={() => {
                setCurrentLayout(layout as any)
              }}
              className={`layout-option ${currentLayout === layout ? 'active' : ''}`}
            >
              {layout}
            </button>
          ))}
        </div>

        <h3># Número de imágenes</h3>
        <div className='layout-options'>
          {[1, 2, 3, 4, 5].map(layout => (
            <button
              key={newKey()}
              onClick={() => {
                setLayoutCounter(layout)
              }}
              className={`layout-option ${layoutCounter === layout ? 'active' : ''}`}
            >
              {layout}
            </button>
          ))}
        </div>
      </Popup>
    </>
  )
}

export default LayoutConfiguration
