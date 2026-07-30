'use client'

import BorderStyle from '@views/image-studio/Popups/common/components/border/style'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import type { FC } from 'react'

const StyleBuilder: FC = () => {
  const borderState = useCanvasBorderStore()
  return <BorderStyle borderState={borderState} />
}

export default StyleBuilder
