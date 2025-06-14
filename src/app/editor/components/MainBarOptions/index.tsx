'use client'

import IconButton from '@/shared/ui/IconButton'
import { ImagePlusIcon, SlidersHorizontalIcon } from 'lucide-react'
import type { FC } from 'react'

import BackgroundConfiguration from '../../Popups/BackgroundConfiguration'
import CornerConfiguration from '../../Popups/CornerConfiguration'
import LayoutConfiguration from '../../Popups/LayoutConfiguration'
import ShadowConfiguration from '../../Popups/ShadowConfiguration'

const MainBarOptions: FC = () => {
  return (
    <>
      <section className='mainBar-section'>
        <h5>Fondo: </h5>
        <BackgroundConfiguration />
        <IconButton label='Imagen del fondo' transparent>
          <ImagePlusIcon />
        </IconButton>
        <IconButton label='Filtros del fondo' transparent>
          <SlidersHorizontalIcon />
        </IconButton>
      </section>

      <section className='mainBar-section'>
        <div className='separator' />
        <h5>Imágenes: </h5>
        <CornerConfiguration />
        <ShadowConfiguration />
        <LayoutConfiguration />

        <IconButton label='Filtros del fondo' transparent>
          <SlidersHorizontalIcon />
        </IconButton>
      </section>
    </>
  )
}

export default MainBarOptions
