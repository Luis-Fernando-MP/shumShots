'use client'

import SizePresetsSection from '@views/image-studio/shared/components/SizePresetsSection'
import { BACKGROUND_SIZE_PRESETS } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

const BackgroundSizeController: FC = () => {
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const setBackgroundWidth = useBackgroundStore(s => s.setBackgroundWidth)
  const setBackgroundHeight = useBackgroundStore(s => s.setBackgroundHeight)
  const setBackgroundSize = useBackgroundStore(s => s.setBackgroundSize)

  return (
    <SizePresetsSection
      title='Tamaño'
      description='Default (900×600) es la base. Los demás guardan su ratio y nunca quedan más pequeños.'
      width={backgroundWidth}
      height={backgroundHeight}
      setWidth={setBackgroundWidth}
      setHeight={setBackgroundHeight}
      setSize={setBackgroundSize}
      presets={BACKGROUND_SIZE_PRESETS}
    />
  )
}

export default BackgroundSizeController
