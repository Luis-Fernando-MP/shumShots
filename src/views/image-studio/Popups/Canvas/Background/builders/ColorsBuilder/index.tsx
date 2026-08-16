'use client'

import ColorsController from '@common/components/ColorsController'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const ColorsBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <SectionBlock title='Colores' description='Rellena el fondo con un color sólido o personalizado.'>
      <ColorsController background={background} setBackground={setBackground} />
    </SectionBlock>
  )
}

export default ColorsBuilder
