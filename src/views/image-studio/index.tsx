'use client'

import Board from '@/shared/components/Board'
import APP_Z_INDEX from '@common/constants/z-index'
import MainBar from '@views/pixis/components/MainBar'
import { type FC } from 'react'

import ImageStudioPersistGate from './components/ImageStudioPersistGate'
import MainBarOptions from './components/MainBarOptions'
import ShotEditor from './components/ShotEditor'

const ImageStudioView: FC = () => {
  return (
    <ImageStudioPersistGate>
      <MainBar
        className='absolute bottom-5 left-1/2 -translate-x-1/2'
        style={{ zIndex: APP_Z_INDEX.studio.mainBar }}
      >
        <MainBarOptions />
      </MainBar>

      <main className='size-full'>
        <Board isCenter={false} normalScale>
          {() => <ShotEditor />}
        </Board>
      </main>
    </ImageStudioPersistGate>
  )
}

export default ImageStudioView
