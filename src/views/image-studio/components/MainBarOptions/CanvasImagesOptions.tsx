'use client'

import Corner from '@views/image-studio/Popups/CanvasImages/Corner'
import Frame from '@views/image-studio/Popups/CanvasImages/Frame'
import ImagesCount from '@views/image-studio/Popups/CanvasImages/ImagesCount'
import Layout from '@views/image-studio/Popups/CanvasImages/Layout'
import ShadowLight from '@views/image-studio/Popups/CanvasImages/ShadowLight'
import SlotSize from '@views/image-studio/Popups/CanvasImages/SlotSize'
import type { FC } from 'react'

const CanvasImagesOptions: FC = () => (
  <section className='gap-grid flex flex-row items-center'>
    <div className='bg-border h-6 w-px' />
    <Corner />
    <Frame />
    <ShadowLight />
    <ImagesCount />
    <Layout />
    <SlotSize />
  </section>
)

export default CanvasImagesOptions
