'use client'

import BorderRadiusConfiguration from '@/shared/components/BorderRadiusConfiguration'
import Typography from '@common/ui/Typography'
import useBackgroundRadiusStore from '@views/image-studio/store/background/backgroundRadius.store'
import type { FC } from 'react'

const RadiusController: FC = () => {
  const borderStore = useBackgroundRadiusStore()

  return (
    <Typography.Block title='Redondeado' className='gap-grid flex flex-col'>
      <BorderRadiusConfiguration borderState={borderStore} />
    </Typography.Block>
  )
}

export default RadiusController
