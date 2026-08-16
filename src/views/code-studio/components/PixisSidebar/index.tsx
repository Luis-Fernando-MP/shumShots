'use client'

import Button from '@common/components/Button'
import App from '@common/components/layout'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import UserPixisPreferences from '@views/code-studio/components/UserPixisPreferences'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { AppWindowIcon, RatioIcon } from 'lucide-react'
import { type FC } from 'react'

const PixisSidebar: FC = () => {
  const resetPixis = usePixisPreferencesStore(s => s.resetPixis)
  const { query, setQuery } = usePreferenceSearchState()

  return (
    <>
      <App.leftSidebar.header>
        <PreferenceSearch value={query} onChange={setQuery} />
      </App.leftSidebar.header>

      <App.tabs defaultValue='ventana'>
        <App.tab
          value='ventana'
          label='Ventana'
          description='Controles, tabs y marcos del shot'
          icon={AppWindowIcon}
        >
          <UserPixisPreferences groupId='chrome' query={query} />
        </App.tab>
        <App.tab value='lienzo' label='Lienzo' description='Radio, proporción y escala' icon={RatioIcon}>
          <UserPixisPreferences groupId='pixis' query={query} />
        </App.tab>
      </App.tabs>

      <App.leftSidebar.footer>
        <Button variant='outline' size='sm' className='w-full rounded-[12px] text-xs' onClick={() => resetPixis()}>
          Resetear ventana y lienzo
        </Button>
      </App.leftSidebar.footer>
    </>
  )
}

export default PixisSidebar
