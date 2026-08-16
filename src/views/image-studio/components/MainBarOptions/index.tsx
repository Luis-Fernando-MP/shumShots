'use client'

import ShotCapture from '@common/components/ShotCapture'
import type { FC } from 'react'

import CanvasImagesOptions from './CanvasImagesOptions'
import CanvasOptions from './CanvasOptions'

const MainBarOptions: FC = () => (
  <>
    <CanvasOptions />
    <CanvasImagesOptions />
    <section className='gap-grid flex flex-row items-center'>
      <div className='bg-border h-6 w-px' />
      <ShotCapture target='editor' compress={false} scale={6} missingTitle='No se encontró el canvas' />
    </section>
  </>
)

export default MainBarOptions
