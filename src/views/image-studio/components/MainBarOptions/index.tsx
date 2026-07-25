'use client'

import UnsplashPicker from '@common/components/UnsplashPicker'
import Button from '@/shared/ui/Button'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { ImagePlusIcon, SlidersHorizontalIcon } from 'lucide-react'
import type { FC } from 'react'

import BackgroundConfiguration from '../../Popups/BackgroundConfiguration'
import CanvasBorderConfiguration from '../../Popups/CanvasBorderConfiguration'
import CornerConfiguration from '../../Popups/CornerConfiguration'
import ShadowConfiguration from '../../Popups/ShadowConfiguration'

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

        <Button size='icon' tooltip='Filtros del fondo'>
          <SlidersHorizontalIcon />
        </Button>
      </section>

      <section className='gap-grid flex flex-row items-center'>
        <div className='bg-border h-6 w-px' />
        <CornerConfiguration />
        <ShadowConfiguration />

        <Button size='icon' tooltip='Filtros de la imagen'>
          <SlidersHorizontalIcon />
        </Button>
      </section>
    </>
  )
}

export default MainBarOptions
