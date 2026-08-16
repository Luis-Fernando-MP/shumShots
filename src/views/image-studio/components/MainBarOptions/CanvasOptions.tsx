'use client'

import { Button } from '@common/components/Button'
import UnsplashPicker from '@common/components/UnsplashPicker'
import Background from '@views/image-studio/Popups/Canvas/Background'
import CanvasBorder from '@views/image-studio/Popups/Canvas/CanvasBorder'
import Light from '@views/image-studio/Popups/Canvas/Light'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { ImagePlusIcon } from 'lucide-react'
import type { FC } from 'react'

/**
 * Opciones globales del lienzo (Background, Borde, Luz, Unsplash).
 * 
 * @returns Sección de controles para el fondo y estilo del lienzo.
 */
const CanvasOptions: FC = () => {
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <section className='gap-grid flex flex-row items-center'>
      <Background />
      <CanvasBorder />
      <Light />
      <UnsplashPicker onSelect={url => setBackground(url)} title='Fondos Unsplash'>
        <Button size='icon' tooltip='Imagen del fondo'>
          <ImagePlusIcon />
        </Button>
      </UnsplashPicker>
    </section>
  )
}

export default CanvasOptions
