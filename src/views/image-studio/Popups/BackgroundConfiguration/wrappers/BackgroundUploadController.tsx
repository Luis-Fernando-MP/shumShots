'use client'

import UploadImageController from '@/shared/components/UploadImageController'
import Typography from '@common/ui/Typography'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

const BackgroundUploadController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <Typography.Block title='Imagen' className='gap-grid flex flex-col'>
      <UploadImageController background={background} setBackground={setBackground} />
    </Typography.Block>
  )
}

export default BackgroundUploadController
