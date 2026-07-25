'use client'

import BorderStylePresets from '@/shared/components/BorderStylePresets'
import useBackgroundBorderStore from '@views/image-studio/store/background/backgroundBorder.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const CanvasBorderStyleController: FC = () => {
  const borderState = useBackgroundBorderStore()

  return (
    <SectionBlock title='Estilo de borde'>
      <BorderStylePresets borderState={borderState} />
    </SectionBlock>
  )
}

export default CanvasBorderStyleController
