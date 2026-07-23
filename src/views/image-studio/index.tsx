'use client'

import Board from '@/shared/components/Board'
import { type FC } from 'react'

import ShotEditor from './components/shotEditor'

const ImageStudioView: FC = () => {
  return (
    <main className='size-full'>
      <Board isCenter={false} normalScale>
        {() => <ShotEditor />}
      </Board>
    </main>
  )
}

export default ImageStudioView
