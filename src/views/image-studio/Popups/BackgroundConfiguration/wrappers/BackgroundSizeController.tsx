'use client'

import SizeController from '@/shared/components/SizeController'
import Typography from '@common/ui/Typography'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

const BackgroundSizeController: FC = () => {
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const setBackgroundWidth = useBackgroundStore(s => s.setBackgroundWidth)
  const setBackgroundHeight = useBackgroundStore(s => s.setBackgroundHeight)

  return (
    <Typography.Block title='Tamaño' className='gap-grid flex flex-col'>
      <SizeController
        width={backgroundWidth}
        height={backgroundHeight}
        setWidth={setBackgroundWidth}
        setHeight={setBackgroundHeight}
      />
    </Typography.Block>
  )
}

export default BackgroundSizeController
