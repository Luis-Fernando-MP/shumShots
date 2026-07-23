'use client'

import Board from '@/shared/components/Board'
import { type FC } from 'react'

import MonacoEditor from './components/MonacoEditor'

const CodeStudioView: FC = () => {
  return (
    <main className='size-full'>
      <Board isCenter={false} normalScale>
        {() => (
          <div className='rounded-radius bg-primary p-2.5' id='monacoEditor-container'>
            <MonacoEditor />
          </div>
        )}
      </Board>
    </main>
  )
}

export default CodeStudioView
