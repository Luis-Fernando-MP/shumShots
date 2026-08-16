'use client'

import Board from '@common/components/Board'
import App from '@common/components/layout'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import StudioTopDock from '@views/pixis/components/StudioTopDock'
import { type FC } from 'react'

import MainBarOptions from './components/MainBarOptions'
import MonacoEditor from './components/MonacoEditor'
import MonacoSidebar from './components/MonacoSidebar'
import PixisSidebar from './components/PixisSidebar'

const CodeStudioView: FC = () => {
  const pixis = usePixisPreferencesStore(s => s.pixis)

  return (
    <App>
      <App.leftSidebar>
        <PixisSidebar />
      </App.leftSidebar>

      <App.canvas>
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
      </App.canvas>

      <App.rightSidebar>
        <MonacoSidebar />
      </App.rightSidebar>

      <App.topDock>
        <StudioTopDock />
      </App.topDock>

      <App.bottomDock>
        <MainBarOptions />
      </App.bottomDock>
    </App>
  )
}

export default CodeStudioView
