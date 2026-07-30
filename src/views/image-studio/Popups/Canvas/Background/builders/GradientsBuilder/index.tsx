'use client'

import GradientsController from '@/shared/components/GradientsController'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const GradientsBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)
  const blendMode = useBackgroundStore(s => s.blendMode)
  const setBlendMode = useBackgroundStore(s => s.setBlendMode)

  return (
    <SectionBlock title='Gradientes' description='Fondos con degradados lineales o circulares.'>
      <GradientsController
        background={background}
        setBackground={setBackground}
        blendMode={blendMode}
        setBlendMode={setBlendMode}
      />
    </SectionBlock>
  )
}

export default GradientsBuilder
