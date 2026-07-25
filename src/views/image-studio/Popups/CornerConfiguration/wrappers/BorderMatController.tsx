'use client'

import useImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import type { FC } from 'react'

import BorderMatControls from '../../shared/BorderMatControls'

const BorderMatController: FC = () => {
  const borderState = useImagesBorderStore()
  return <BorderMatControls borderState={borderState} />
}

export default BorderMatController
