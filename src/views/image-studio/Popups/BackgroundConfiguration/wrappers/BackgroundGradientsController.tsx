'use client'

import GradientsController from '@/shared/components/GradientsController'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

const BackgroundGradientsController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)
  const blendMode = useBackgroundStore(s => s.blendMode)
  const setBlendMode = useBackgroundStore(s => s.setBlendMode)

  return (
    <GradientsController
      background={background}
      setBackground={setBackground}
      blendMode={blendMode}
      setBlendMode={setBlendMode}
    />
  )
}

export default BackgroundGradientsController
