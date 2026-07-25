'use client'

import FrameTemplatePresets from '@/shared/components/FrameTemplatePresets'
import useBackgroundBorderStore from '@views/image-studio/store/background/backgroundBorder.store'
import useBackgroundRadiusStore from '@views/image-studio/store/background/backgroundRadius.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const CanvasFrameTemplateController: FC = () => {
  const borderState = useBackgroundBorderStore()
  const setBorderRadius = useBackgroundRadiusStore(s => s.setBorderRadius)

  return (
    <SectionBlock title='Plantillas de frame' description='Polaroid, marco o tarjeta.'>
      <FrameTemplatePresets
        borderState={borderState}
        onApplyRadius={radius => {
          setBorderRadius?.(radius)
          useBackgroundRadiusStore.setState({
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

export default CanvasFrameTemplateController
