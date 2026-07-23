'use client'

import IconButton from '@/shared/ui/IconButton'
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
        <IconButton label='Imagen del fondo' transparent>
          <ImagePlusIcon />
        </IconButton>
        <IconButton label='Filtros del fondo' transparent>
          <SlidersHorizontalIcon />
        </IconButton>
      </section>

      <section className='flex flex-row items-center gap-grid'>
        <div className='h-6 w-px bg-border' />
        <span className='text-xs text-muted-foreground'>Imágenes:</span>
        <CornerConfiguration />
        <ShadowConfiguration />

        <IconButton label='Filtros del fondo' transparent>
          <SlidersHorizontalIcon />
        </IconButton>
      </section>
    </>
  )
}

export default MainBarOptions
