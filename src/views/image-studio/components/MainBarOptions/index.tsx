'use client'

import Button from '@/shared/ui/Button'
import { ImagePlusIcon, SlidersHorizontalIcon } from 'lucide-react'
import type { FC } from 'react'

import BackgroundConfiguration from '../../Popups/BackgroundConfiguration'
import CornerConfiguration from '../../Popups/CornerConfiguration'
import ShadowConfiguration from '../../Popups/ShadowConfiguration'

const MainBarOptions: FC = () => {
  return (
    <>
      <section className='gap-grid flex flex-row items-center'>
        <BackgroundConfiguration />

        <Button size='icon' tooltip='Imagen del fondo'>
          <ImagePlusIcon />
        </Button>
        <Button size='icon' tooltip='Filtros del fondo'>
          <SlidersHorizontalIcon />
        </Button>
      </section>

      <section className='gap-grid flex flex-row items-center'>
        <div className='bg-border h-6 w-px' />
        <CornerConfiguration />
        <ShadowConfiguration />

        <Button size='icon' tooltip='Filtros del fondo'>
          <SlidersHorizontalIcon />
        </Button>
      </section>
    </>
  )
}

export default MainBarOptions
