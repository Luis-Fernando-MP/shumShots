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
      <section className='flex flex-row items-center gap-grid'>
        <span className='text-xs text-muted-foreground'>Fondo:</span>
        <BackgroundConfiguration />
        <Button tooltip='Imagen del fondo'>
          <ImagePlusIcon />
        </Button>
        <Button tooltip='Filtros del fondo'>
          <SlidersHorizontalIcon />
        </Button>
      </section>

      <section className='flex flex-row items-center gap-grid'>
        <div className='h-6 w-px bg-border' />
        <span className='text-xs text-muted-foreground'>Imágenes:</span>
        <CornerConfiguration />
        <ShadowConfiguration />

        <Button tooltip='Filtros del fondo'>
          <SlidersHorizontalIcon />
        </Button>
      </section>
    </>
  )
}

export default MainBarOptions
