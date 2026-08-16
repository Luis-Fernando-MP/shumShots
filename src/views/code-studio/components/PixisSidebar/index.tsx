'use client'

import Button from '@common/components/Button'
import App from '@common/components/layout'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import UserPixisPreferences from '@views/code-studio/components/UserPixisPreferences'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import { type FC } from 'react'

const PixisSidebar: FC = () => {
  const resetPixis = usePixisPreferencesStore(s => s.resetPixis)
  const resetPreferences = usePixisPreferencesStore(s => s.resetPreferences)
  const resetWorkspace = useWorkspaceStore(s => s.resetWorkspace)
  const { query, setQuery } = usePreferenceSearchState()

  const resetAllChanges = () => {
    resetPreferences()
    resetWorkspace()
  }

  return (
    <App.tabs
      defaultValue='ventana'
      footer={
        <footer className='border-border/50 flex shrink-0 flex-col gap-2 border-t px-3 py-2.5'>
          <PreferenceSearch value={query} onChange={setQuery} />
          <Button variant='dashed' status='primary' className='w-full rounded-[12px]' onClick={() => resetPixis()}>
            Restablecer configuración
          </Button>
          <Button variant='dashed' status='error' className='w-full rounded-[12px]' onClick={resetAllChanges}>
            Resetear cambios
          </Button>
        </footer>
      }
    >
      <App.tab value='ventana' label='Ventana'>
        <UserPixisPreferences groupId='chrome' query={query} />
      </App.tab>
      <App.tab value='lienzo' label='Lienzo'>
        <UserPixisPreferences groupId='pixis' query={query} />
      </App.tab>
    </App.tabs>
  )
}

export default PixisSidebar
