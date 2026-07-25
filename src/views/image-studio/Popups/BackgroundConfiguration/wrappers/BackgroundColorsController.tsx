'use client'

import ColorsController from '@/shared/components/ColorsController'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

import SectionBlock from './SectionBlock'

const BackgroundColorsController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <SectionBlock title='Colores' description='Rellena el fondo con un color sólido o personalizado.'>
      <ColorsController background={background} setBackground={setBackground} />
    </SectionBlock>
  )
}

export default BackgroundColorsController
