'use client'

import Button from '@common/components/Button'
import App from '@common/components/layout'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import UserMonacoPreferences from '@views/code-studio/components/UserMonacoPreferences'
import useDiffHistoryStore from '@views/code-studio/store/diffHistory.store'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { type FC } from 'react'

const MonacoSidebar: FC = () => {
  const resetMonaco = usePixisPreferencesStore(s => s.resetMonaco)
  const resetDiffHistory = useDiffHistoryStore(s => s.resetDiffHistory)
  const { resetTheme } = useMonacoThemeStore()
  const { query, setQuery } = usePreferenceSearchState()

  return (
    <App.tabs
      defaultValue='temas'
      footer={
        <footer className='border-border/50 flex shrink-0 flex-col gap-2 border-t px-3 py-2.5'>
          <PreferenceSearch value={query} onChange={setQuery} />
          <Button
            variant='dashed'
            status='primary'
            className='w-full rounded-[12px]'
            onClick={() => {
              resetMonaco()
              resetTheme()
              resetDiffHistory()
            }}
          >
            Restablecer configuración
          </Button>
        </footer>
      }
    >
      <App.tab value='temas' label='Temas'>
        <UserMonacoPreferences tab='themes' query={query} />
      </App.tab>
      <App.tab value='lenguaje' label='Lenguaje'>
        <UserMonacoPreferences tab='languages' query={query} />
      </App.tab>
      <App.tab value='fuente' label='Fuente'>
        <UserMonacoPreferences tab='fonts' query={query} />
      </App.tab>
      <App.tab value='editor' label='Editor'>
        <UserMonacoPreferences tab='editor' query={query} />
      </App.tab>
    </App.tabs>
  )
}

export default MonacoSidebar
