'use client'

import BorderSize from '@views/image-studio/Popups/common/components/border/size'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import type { FC } from 'react'

const SizeBuilder: FC = () => {
  const size = useCanvasBorderStore(s => s.size)
  const type = useCanvasBorderStore(s => s.type)
  const setSize = useCanvasBorderStore(s => s.setSize)

  return (
    <BorderSize
      size={size}
      type={type}
      setSize={setSize}
      defaultSize={4}
      description='Ancho del borde del canvas.'
    />
  )
}

export default SizeBuilder
