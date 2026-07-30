'use client'

import BorderMat from '@views/image-studio/Popups/common/components/border/mat'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import type { FC } from 'react'

const MatBuilder: FC = () => {
  const borderState = useCanvasBorderStore()
  return <BorderMat borderState={borderState} />
}

export default MatBuilder
