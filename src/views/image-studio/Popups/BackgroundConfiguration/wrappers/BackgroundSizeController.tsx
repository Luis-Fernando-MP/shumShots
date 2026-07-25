'use client'

import SizeController from '@/shared/components/SizeController'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

import SectionBlock from './SectionBlock'

const BackgroundSizeController: FC = () => {
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const setBackgroundWidth = useBackgroundStore(s => s.setBackgroundWidth)
  const setBackgroundHeight = useBackgroundStore(s => s.setBackgroundHeight)

  return (
    <SectionBlock title='Tamaño' description='Ancho y alto del fondo del editor.'>
      <SizeController
        width={backgroundWidth}
        height={backgroundHeight}
        setWidth={setBackgroundWidth}
        setHeight={setBackgroundHeight}
      />
    </SectionBlock>
  )
}

export default BackgroundSizeController
