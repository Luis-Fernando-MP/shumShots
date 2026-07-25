'use client'

import FrameTemplatePresets from '@/shared/components/FrameTemplatePresets'
import useImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import useImagesRadiusStore from '@views/image-studio/store/images/imagesRadius.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const FrameTemplateController: FC = () => {
  const borderState = useImagesBorderStore()

  return (
    <SectionBlock title='Plantillas de frame' description='Polaroid, marco o tarjeta.'>
      <FrameTemplatePresets
        borderState={borderState}
        onApplyRadius={radius => {
          useImagesRadiusStore.setState({
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

export default FrameTemplateController
