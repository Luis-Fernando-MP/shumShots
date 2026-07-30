'use client'

import UploadImageController from '@/shared/components/UploadImageController'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const UploadBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <SectionBlock title='Imagen' description='Sube una imagen local para usarla como fondo.'>
      <UploadImageController background={background} setBackground={setBackground} />
    </SectionBlock>
  )
}

export default UploadBuilder
