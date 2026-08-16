'use client'

import Separator from '@common/components/Separator'
import Corner from '@views/image-studio/Popups/CanvasImages/Corner'
import Frame from '@views/image-studio/Popups/CanvasImages/Frame'
import ImagesCount from '@views/image-studio/Popups/CanvasImages/ImagesCount'
import Layout from '@views/image-studio/Popups/CanvasImages/Layout'
import ShadowLight from '@views/image-studio/Popups/CanvasImages/ShadowLight'
import SlotSize from '@views/image-studio/Popups/CanvasImages/SlotSize'
import type { FC } from 'react'

/**
 * Opciones para las imágenes del lienzo (Esquinas, Marcos, Sombras, Layout, etc).
 * 
 * @returns Sección de controles para las capas de imágenes.
 */
const CanvasImagesOptions: FC = () => (
  <section className='gap-grid flex flex-row items-center'>
    <Separator />
    <Corner />
    <Frame />
    <ShadowLight />
    <ImagesCount />
    <Layout />
    <SlotSize />
  </section>
)

export default CanvasImagesOptions
