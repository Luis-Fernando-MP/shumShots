'use client'

import Board from '@common/components/Board'
import App from '@common/components/layout'
import StudioTopDock from '@views/pixis/components/StudioTopDock'
import { type FC } from 'react'

import CanvasImagesSidebar from './components/CanvasImagesSidebar'
import CanvasSidebar from './components/CanvasSidebar'
import ImageStudioPersistGate from './components/ImageStudioPersistGate'
import MainBarOptions from './components/MainBarOptions'
import ShotEditor from './components/ShotEditor'

/**
 * Vista principal de Image Studio.
 *
 * Compone el editor de imágenes con persistencia, chrome de estudio y el lienzo.
 *
 * @returns La composición de la vista del estudio de imágenes.
 */
const ImageStudioView: FC = () => {
  return (
    <ImageStudioPersistGate>
      <App>
        <App.leftSidebar>
          <CanvasSidebar />
        </App.leftSidebar>

        <App.canvas>
          <Board isCenter={false} normalScale>
            {() => <ShotEditor />}
          </Board>
        </App.canvas>

        <App.rightSidebar>
          <CanvasImagesSidebar />
        </App.rightSidebar>

        <App.topDock>
          <StudioTopDock />
        </App.topDock>

        <App.bottomDock>
          <MainBarOptions />
        </App.bottomDock>
      </App>
    </ImageStudioPersistGate>
  )
}

export default ImageStudioView
