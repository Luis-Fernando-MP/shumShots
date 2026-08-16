'use client'

import SliderControl from '@common/components/SliderControl'
import ColorPicker from '@common/components/ColorPicker'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const OverlayBuilder: FC = () => {
  const overlayColor = useBackgroundStore(s => s.overlayColor)
  const overlayOpacity = useBackgroundStore(s => s.overlayOpacity)
  const setOverlayColor = useBackgroundStore(s => s.setOverlayColor)
  const setOverlayOpacity = useBackgroundStore(s => s.setOverlayOpacity)

  return (
    <SectionBlock
      title='Overlay'
      description='Capa de color encima del fondo para bajar contraste o teñir la escena.'
    >
      <div className='gap-grid flex items-end'>
        <ColorPicker
          variant='swatch'
          value={overlayColor}
          onChange={setOverlayColor}
          label='Color del overlay'
          disableAlpha
          className='rounded-md'
        />
        <SliderControl
          label='Opacidad'
          value={overlayOpacity}
          onChangeRange={setOverlayOpacity}
          min={0}
          max={100}
          step={1}
        />
      </div>
    </SectionBlock>
  )
}

export default OverlayBuilder
