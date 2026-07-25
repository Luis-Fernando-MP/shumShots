'use client'

import Board from '@/shared/components/Board'
import MainBar from '@views/pixis/components/MainBar'
import { type FC } from 'react'

import MainBarOptions from './components/MainBarOptions'
import ShotEditor from './components/ShotEditor'

const ImageStudioView: FC = () => {
  return (
    <>
      <MainBar className='absolute bottom-5 left-1/2 z-10 -translate-x-1/2'>
        <MainBarOptions />
      </MainBar>

      <main className='size-full'>
        <Board isCenter={false} normalScale>
          {() => <ShotEditor />}
        </Board>
      </main>
    </>
  )
}

export default ImageStudioView
