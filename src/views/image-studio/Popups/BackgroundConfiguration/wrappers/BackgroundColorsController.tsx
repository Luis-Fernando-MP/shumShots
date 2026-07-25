'use client'

import ColorsController from '@/shared/components/ColorsController'
import Typography from '@common/ui/Typography'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

const BackgroundColorsController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <Typography.Block title='Colores' className='gap-grid flex flex-col'>
      <ColorsController background={background} setBackground={setBackground} />
    </Typography.Block>
  )
}

export default BackgroundColorsController
