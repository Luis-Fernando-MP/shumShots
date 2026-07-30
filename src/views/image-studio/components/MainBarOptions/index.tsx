'use client'

import Button from '@/shared/ui/Button'
import UnsplashPicker from '@common/components/UnsplashPicker'
import ShotCapture from '@common/ui/ShotCapture'
import Background from '@views/image-studio/Popups/Canvas/Background'
import CanvasBorder from '@views/image-studio/Popups/Canvas/CanvasBorder'
import Light from '@views/image-studio/Popups/Canvas/Light'
import Corner from '@views/image-studio/Popups/CanvasImages/Corner'
import Frame from '@views/image-studio/Popups/CanvasImages/Frame'
import ImagesCount from '@views/image-studio/Popups/CanvasImages/ImagesCount'
import ShadowLight from '@views/image-studio/Popups/CanvasImages/ShadowLight'
import SlotSize from '@views/image-studio/Popups/CanvasImages/SlotSize'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { ImagePlusIcon } from 'lucide-react'
import type { FC } from 'react'

const MainBarOptions: FC = () => {
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <>
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

      <section className='gap-grid flex flex-row items-center'>
        <div className='bg-border h-6 w-px' />

        <Corner />
        <Frame />
        <ShadowLight />
        <ImagesCount />
        <SlotSize />
      </section>

      <section className='gap-grid flex flex-row items-center'>
        <div className='bg-border h-6 w-px' />
        <ShotCapture target='editor' compress={false} scale={6} missingTitle='No se encontró el canvas' />
      </section>
    </>
  )
}

export default MainBarOptions
