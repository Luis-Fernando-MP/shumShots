'use client'

import Button from '@common/components/Button'
import App from '@common/components/layout'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import UserMonacoPreferences from '@views/code-studio/components/UserMonacoPreferences'
import useDiffHistoryStore from '@views/code-studio/store/diffHistory.store'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { PaletteIcon, SlidersHorizontalIcon } from 'lucide-react'
import { type FC } from 'react'

const MonacoSidebar: FC = () => {
  const resetMonaco = usePixisPreferencesStore(s => s.resetMonaco)
  const resetDiffHistory = useDiffHistoryStore(s => s.resetDiffHistory)
  const { resetTheme } = useMonacoThemeStore()
  const { query, setQuery } = usePreferenceSearchState()

  return (
    <>
      <App.rightSidebar.header>
        <PreferenceSearch value={query} onChange={setQuery} />
      </App.rightSidebar.header>

      <App.tabs defaultValue='apariencia'>
        <App.tab
          value='apariencia'
          label='Apariencia'
          description='Tema, lenguaje y tipografía del shot'
          icon={PaletteIcon}
        >
          <UserMonacoPreferences tab='appearance' query={query} />
        </App.tab>
        <App.tab
          value='editor'
          label='Editor'
          description='Wrap, cursor, minimapa y comportamiento'
          icon={SlidersHorizontalIcon}
        >
          <UserMonacoPreferences tab='editor' query={query} />
        </App.tab>
      </App.tabs>

      <App.rightSidebar.footer>
        <Button
          variant='outline'
          size='sm'
          className='w-full rounded-[12px] text-xs'
          onClick={() => {
            resetMonaco()
            resetTheme()
            resetDiffHistory()
          }}
        >
          Resetear editor
        </Button>
      </App.rightSidebar.footer>
    </>
  )
}

export default MonacoSidebar
