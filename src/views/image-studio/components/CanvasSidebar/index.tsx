'use client'

import UnsplashPicker from '@common/components/UnsplashPicker'
import App from '@common/components/layout'
import Background from '@views/image-studio/Popups/Canvas/Background'
import CanvasBorder from '@views/image-studio/Popups/Canvas/CanvasBorder'
import Light from '@views/image-studio/Popups/Canvas/Light'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { type FC } from 'react'

const CanvasSidebar: FC = () => {
  const setBackground = useBackgroundStore(s => s.setBackground)

  return (
    <App.tabs defaultValue='fondo'>
      <App.tab value='fondo' label='Fondo'>
        <Background />
      </App.tab>
      <App.tab value='borde' label='Borde'>
        <CanvasBorder />
      </App.tab>
      <App.tab value='luz' label='Luz'>
        <Light />
      </App.tab>
      <App.tab value='unsplash' label='Unsplash'>
        <UnsplashPicker embedded onSelect={url => setBackground(url)} />
      </App.tab>
    </App.tabs>
  )
}

export default CanvasSidebar
