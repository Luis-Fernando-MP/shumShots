'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import Typography from '@common/ui/Typography'
import { PreferenceSearchProvider } from '@views/code-studio/components/preferences/PreferenceField'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import { LayoutTemplate } from 'lucide-react'
import { type FC } from 'react'

import SetterPixisPreferences from './preferences/SetterPixisPreferences'

const UserPixisPreferences: FC = () => {
  const resetPixis = usePixisPreferencesStore(s => s.resetPixis)
  const resetPreferences = usePixisPreferencesStore(s => s.resetPreferences)
  const resetWorkspace = useWorkspaceStore(s => s.resetWorkspace)
  const { query, setQuery } = usePreferenceSearchState()
  const hasQuery = Boolean(query.trim())

  const resetAllChanges = () => {
    resetPreferences()
    resetWorkspace()
  }

  return (
    <Popup className='h-[min(700px,85dvh)] w-[min(100vw-2rem,420px)]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Configurar pixis'>
          <LayoutTemplate />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Pixis config</Popup.Header>

      <Popup.Content className='scrollbar-hidden flex flex-col gap-5'>
        <PreferenceSearchProvider query={query}>
          <div className='flex flex-col gap-5 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
            <SetterPixisPreferences />

            {hasQuery && (
              <div
                data-preference-empty
                className='border-border/50 bg-card/30 flex flex-col items-center gap-1 rounded-md border border-dashed px-4 py-8 text-center'
              >
                <Typography.Emphasis className='leading-snug'>Sin resultados</Typography.Emphasis>
                <Typography.Paragraph tone='secondary' className='m-0 max-w-[16rem] leading-snug'>
                  No hay preferencias que coincidan con “{query.trim()}”.
                </Typography.Paragraph>
              </div>
            )}
          </div>
        </PreferenceSearchProvider>
      </Popup.Content>

      <Popup.Footer className='flex-col items-stretch gap-2.5'>
        <PreferenceSearch value={query} onChange={setQuery} />
        <div className='flex flex-col gap-1.5'>
          <Button variant='dashed' status='primary' className='w-full' onClick={() => resetPixis()}>
            Restablecer configuración
          </Button>
          <Button variant='dashed' status='error' className='w-full' onClick={resetAllChanges}>
            Resetear cambios
          </Button>
        </div>
      </Popup.Footer>
    </Popup>
  )
}

export default UserPixisPreferences
