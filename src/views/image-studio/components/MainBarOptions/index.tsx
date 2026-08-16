'use client'

import Separator from '@common/components/Separator'
import ShotCapture from '@common/components/ShotCapture'
import type { FC } from 'react'

import CanvasImagesOptions from './CanvasImagesOptions'
import CanvasOptions from './CanvasOptions'

/**
 * Contenedor de opciones de la barra principal.
 * 
 * Agrupa las configuraciones del lienzo y de las imágenes, además de
 * los controles de captura final.
 * 
 * @returns El conjunto de opciones para la MainBar.
 */
const MainBarOptions: FC = () => (
  <>
    <CanvasOptions />
    <CanvasImagesOptions />
    <section className='gap-grid flex flex-row items-center'>
      <Separator />
      <ShotCapture target='editor' compress={false} scale={6} missingTitle='No se encontró el canvas' />
    </section>
  </>
)

export default MainBarOptions
