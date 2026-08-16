'use client'

import Board from '@common/components/Board'
import APP_Z_INDEX from '@common/constants/z-index'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import MainBar from '@views/pixis/components/MainBar'
import { type FC } from 'react'

import MainBarOptions from './components/MainBarOptions'
import MonacoEditor from './components/MonacoEditor'

const CodeStudioView: FC = () => {
  const pixis = usePixisPreferencesStore(s => s.pixis)

  return (
    <>
      <MainBar
        className='absolute bottom-5 left-1/2 -translate-x-1/2'
        style={{ zIndex: APP_Z_INDEX.studio.mainBar }}
      >
        <MainBarOptions />
      </MainBar>

      <main className='size-full'>
        <Board isCenter={false} normalScale>
          {() => (
            <div
              id='monacoEditor-container'
              className='bg-primary'
              style={{
                padding: pixis.containerPadding,
                borderRadius: pixis.containerBorderRadius
              }}
            >
              <MonacoEditor />
            </div>
          )}
        </Board>
      </main>
    </>
  )
}

export default CodeStudioView
