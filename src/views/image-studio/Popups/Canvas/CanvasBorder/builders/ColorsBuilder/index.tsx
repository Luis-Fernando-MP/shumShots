'use client'

import BorderColor from '@views/image-studio/Popups/common/components/border/color'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import type { FC } from 'react'

const ColorsBuilder: FC = () => {
  const color = useCanvasBorderStore(s => s.color)
  const type = useCanvasBorderStore(s => s.type)
  const setColor = useCanvasBorderStore(s => s.setColor)
  const setType = useCanvasBorderStore(s => s.setType)

  return <BorderColor color={color} type={type} setColor={setColor} setType={setType} />
}

export default ColorsBuilder
