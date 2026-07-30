'use client'

import BorderRadius from '@views/image-studio/Popups/common/components/border/radius'
import useCanvasRadiusStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import type { FC } from 'react'

const RadiusBuilder: FC = () => {
  const borderStore = useCanvasRadiusStore()
  return (
    <BorderRadius
      borderState={borderStore}
      title='Redondeado'
      description='Suaviza las esquinas del canvas.'
    />
  )
}

export default RadiusBuilder
