'use client'

import App from '@common/components/layout'
import Corner from '@views/image-studio/Popups/CanvasImages/Corner'
import Frame from '@views/image-studio/Popups/CanvasImages/Frame'
import ImagesCount from '@views/image-studio/Popups/CanvasImages/ImagesCount'
import Layout from '@views/image-studio/Popups/CanvasImages/Layout'
import ShadowLight from '@views/image-studio/Popups/CanvasImages/ShadowLight'
import SlotSize from '@views/image-studio/Popups/CanvasImages/SlotSize'
import { type FC } from 'react'

const CanvasImagesSidebar: FC = () => (
  <App.tabs defaultValue='esquinas'>
    <App.tab value='esquinas' label='Esquinas'>
      <Corner />
    </App.tab>
    <App.tab value='marco' label='Marco'>
      <Frame />
    </App.tab>
    <App.tab value='sombra' label='Sombra'>
      <ShadowLight />
    </App.tab>
    <App.tab value='recuento' label='Recuento'>
      <ImagesCount />
    </App.tab>
    <App.tab value='layout' label='Layout'>
      <Layout />
    </App.tab>
    <App.tab value='tamano' label='Tamaño'>
      <SlotSize />
    </App.tab>
  </App.tabs>
)

export default CanvasImagesSidebar
