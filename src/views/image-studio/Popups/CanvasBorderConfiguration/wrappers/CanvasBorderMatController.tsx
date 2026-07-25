'use client'

import useBackgroundBorderStore from '@views/image-studio/store/background/backgroundBorder.store'
import type { FC } from 'react'

import BorderMatControls from '../../shared/BorderMatControls'

const CanvasBorderMatController: FC = () => {
  const borderState = useBackgroundBorderStore()
  return <BorderMatControls borderState={borderState} />
}

export default CanvasBorderMatController
