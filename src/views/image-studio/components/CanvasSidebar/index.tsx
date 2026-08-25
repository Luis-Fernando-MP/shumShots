'use client'

import { PreferenceSearch, usePreferenceSearchState } from '@common/components/PreferenceSearch'
import UnsplashPicker from '@common/components/UnsplashPicker'
import App from '@common/components/layout'
import Background from '@views/image-studio/Popups/Canvas/Background'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import CanvasBorder from '@views/image-studio/Popups/Canvas/CanvasBorder'
import Light from '@views/image-studio/Popups/Canvas/Light'
import Portrait from '@views/image-studio/Popups/Canvas/Portrait'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { SectionSearchProvider } from '@views/image-studio/components/section-search'
import { ApertureIcon, BlendIcon, FrameIcon, ImagePlusIcon, SunIcon } from 'lucide-react'
import { type FC } from 'react'

const CanvasSidebar: FC = () => {
  const setBackground = useBackgroundStore(s => s.setBackground)
  const { query, setQuery } = usePreferenceSearchState()

  return (
    <>
      <App.leftSidebar.header>
        <PreferenceSearch value={query} onChange={setQuery} />
      </App.leftSidebar.header>

      <SectionSearchProvider query={query}>
        <App.tabs defaultValue='fondo'>
          <App.tab value='fondo' label='Fondo' description='Color, gradiente y medida del canvas' icon={BlendIcon}>
            <Background />
          </App.tab>

          <App.tab value='borde' label='Borde' description='Radio, trazo y passepartout' icon={FrameIcon}>
            <CanvasBorder />
          </App.tab>

          <App.tab value='luz' label='Luz' description='Capas, presets y foco' icon={SunIcon}>
            <Light />
          </App.tab>

          <App.tab value='retrato' label='Retrato' description='Foco, lupa y grain' icon={ApertureIcon}>
            <Portrait />
          </App.tab>

          <App.tab value='unsplash' label='Unsplash' description='Fotos para el fondo' icon={ImagePlusIcon}>
            <DomainPanel>
              <UnsplashPicker embedded onSelect={url => setBackground(url)} />
            </DomainPanel>
          </App.tab>
        </App.tabs>
      </SectionSearchProvider>
    </>
  )
}

export default CanvasSidebar
