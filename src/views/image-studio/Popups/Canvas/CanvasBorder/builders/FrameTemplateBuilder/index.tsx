'use client'

import FrameTemplatePresets from '@common/components/FrameTemplatePresets'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import useCanvasRadiusStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import type { FC } from 'react'

const FrameTemplateBuilder: FC = () => {
  const borderState = useCanvasBorderStore()
  const setBorderRadius = useCanvasRadiusStore(s => s.setBorderRadius)

  return (
    <SectionBlock title='Plantillas de frame' description='Polaroid, marco o tarjeta.'>
      <FrameTemplatePresets
        borderState={borderState}
        onApplyRadius={radius => {
          setBorderRadius?.(radius)
          useCanvasRadiusStore.setState({
            borderLTRadius: radius,
            borderRTRadius: radius,
            borderRBRadius: radius,
            borderLBRadius: radius,
            borderRadius: radius,
            activeIndividualBorder: false
          })
        }}
      />
    </SectionBlock>
  )
}

export default FrameTemplateBuilder
