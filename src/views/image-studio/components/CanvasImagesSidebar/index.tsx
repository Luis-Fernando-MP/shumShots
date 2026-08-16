'use client'

import { PreferenceSearch, usePreferenceSearchState } from '@common/components/PreferenceSearch'
import App from '@common/components/layout'
import Corner from '@views/image-studio/Popups/CanvasImages/Corner'
import Frame from '@views/image-studio/Popups/CanvasImages/Frame'
import ImagesCount from '@views/image-studio/Popups/CanvasImages/ImagesCount'
import Layout from '@views/image-studio/Popups/CanvasImages/Layout'
import ShadowLight from '@views/image-studio/Popups/CanvasImages/ShadowLight'
import SlotSize from '@views/image-studio/Popups/CanvasImages/SlotSize'
import TextLayers from '@views/image-studio/Popups/CanvasImages/TextLayers'
import { SectionSearchProvider } from '@views/image-studio/components/section-search'
import { CloudSunIcon, LayoutGridIcon, MoveIcon, ScalingIcon, SmartphoneIcon, SquareRoundCornerIcon, TypeIcon } from 'lucide-react'
import { type FC } from 'react'

const CanvasImagesSidebar: FC = () => {
  const { query, setQuery } = usePreferenceSearchState()

  return (
    <>
      <App.rightSidebar.header>
        <PreferenceSearch value={query} onChange={setQuery} />
      </App.rightSidebar.header>
      <SectionSearchProvider query={query}>
        <App.tabs defaultValue='esquinas'>
          <App.tab value='esquinas' label='Esquinas' description='Radio y borde de cada slot' icon={SquareRoundCornerIcon}>
            <Corner />
          </App.tab>
          <App.tab value='marco' label='Marco' description='Dispositivo, ajuste y recorte' icon={SmartphoneIcon}>
            <Frame />
          </App.tab>
          <App.tab value='sombra' label='Sombra' description='Sombras y luces por destino' icon={CloudSunIcon}>
            <ShadowLight />
          </App.tab>
          <App.tab value='recuento' label='Recuento' description='Cuántos slots hay en el lienzo' icon={LayoutGridIcon}>
            <ImagesCount />
          </App.tab>
          <App.tab value='layout' label='Layout' description='Composición y movimiento' icon={MoveIcon}>
            <Layout />
          </App.tab>
          <App.tab value='tamano' label='Tamaño' description='Ancho, alto y escala por capa' icon={ScalingIcon}>
            <SlotSize />
          </App.tab>
          <App.tab value='texto' label='Texto' description='Capas de copy sobre el shot' icon={TypeIcon}>
            <TextLayers />
          </App.tab>
        </App.tabs>
      </SectionSearchProvider>
    </>
  )
}

export default CanvasImagesSidebar
