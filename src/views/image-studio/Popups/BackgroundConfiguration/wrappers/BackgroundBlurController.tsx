'use client'

import SliderControl from '@/shared/components/SliderControl'
import Typography from '@common/ui/Typography'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

const BackgroundBlurController: FC = () => {
  const blur = useBackgroundStore(s => s.blur)
  const setBlur = useBackgroundStore(s => s.setBlur)

  return (
    <Typography.Block title='Blur' className='gap-grid flex flex-col'>
      <SliderControl label='Desenfoque' value={blur} onChangeRange={setBlur} min={0} max={40} step={1} />
    </Typography.Block>
  )
}

export default BackgroundBlurController
