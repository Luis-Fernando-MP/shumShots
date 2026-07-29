'use client'

import Button from '@/shared/ui/Button'
import UnsplashPicker from '@common/components/UnsplashPicker'
import ShotCapture from '@common/ui/ShotCapture'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { ImagePlusIcon } from 'lucide-react'
import type { FC } from 'react'

import BackgroundConfiguration from '../../Popups/BackgroundConfiguration'
import CanvasBorderConfiguration from '../../Popups/CanvasBorderConfiguration'
import CornerConfiguration from '../../Popups/CornerConfiguration'
import FrameConfiguration from '../../Popups/FrameConfiguration'
import ImagesCountConfiguration from '../../Popups/ImagesCountConfiguration'
import ShadowConfiguration from '../../Popups/ShadowConfiguration'
import SlotSizeConfiguration from '../../Popups/SlotSizeConfiguration'

const MainBarOptions: FC = () => {
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <>
      <section className='gap-grid flex flex-row items-center'>
        <BackgroundConfiguration />
        <CanvasBorderConfiguration />

        <UnsplashPicker onSelect={url => setBackground(url)} title='Fondos Unsplash'>
          <Button size='icon' tooltip='Imagen del fondo'>
            <ImagePlusIcon />
          </Button>
        </UnsplashPicker>
      </section>

      <section className='gap-grid flex flex-row items-center'>
        <div className='bg-border h-6 w-px' />

        <CornerConfiguration />
        <FrameConfiguration />
        <ShadowConfiguration />
        <ImagesCountConfiguration />
        <SlotSizeConfiguration />
      </section>

      <section className='gap-grid flex flex-row items-center'>
        <div className='bg-border h-6 w-px' />
        <ShotCapture target='editor' compress={false} scale={6} missingTitle='No se encontró el canvas' />
      </section>
    </>
  )
}

export default MainBarOptions
