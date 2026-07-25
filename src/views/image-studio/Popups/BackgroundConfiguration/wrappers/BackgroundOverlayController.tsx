'use client'

import SliderControl from '@/shared/components/SliderControl'
import ColorPicker from '@common/ui/ColorPicker'
import Typography from '@common/ui/Typography'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

const BackgroundOverlayController: FC = () => {
  const overlayColor = useBackgroundStore(s => s.overlayColor)
  const overlayOpacity = useBackgroundStore(s => s.overlayOpacity)
  const setOverlayColor = useBackgroundStore(s => s.setOverlayColor)
  const setOverlayOpacity = useBackgroundStore(s => s.setOverlayOpacity)

  return (
    <Typography.Block title='Overlay' className='gap-grid flex flex-col'>
      <div className='gap-grid flex items-end'>
        <ColorPicker
          variant='swatch'
          value={overlayColor}
          onChange={setOverlayColor}
          label='Color del overlay'
          disableAlpha
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
    </Typography.Block>
  )
}

export default BackgroundOverlayController
