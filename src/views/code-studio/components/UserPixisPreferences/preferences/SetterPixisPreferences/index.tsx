import Button from '@/shared/ui/Button'
import Typography from '@common/ui/Typography'
import {
  PreferencePanel,
  PreferenceSearchProvider,
  PreferenceSection
} from '@views/code-studio/components/preferences/PreferenceField'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import SchemaPreferenceField from '@views/code-studio/components/preferences/SchemaPreference'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import { getGroup } from '@views/code-studio/utils/preferences.config'
import { type FC, type ReactNode } from 'react'

import AspectRatioPreference from '../AspectRatioPreference'
import WindowChromePreference from '../WindowChromePreference'

const Section = ({
  groupId,
  panel,
  children
}: {
  groupId: Parameters<typeof getGroup>[0]
  panel?: boolean
  children: ReactNode
}) => {
  const group = getGroup(groupId)
  const body = (
    <PreferenceSection title={group.title} subtitle={group.subtitle}>
      {children}
    </PreferenceSection>
  )

  if (panel ?? group.panel) return <PreferencePanel>{body}</PreferencePanel>
  return body
}

const SetterPixisPreferences: FC = () => {
  const resetPixis = usePixisPreferencesStore(s => s.resetPixis)
  const resetPreferences = usePixisPreferencesStore(s => s.resetPreferences)
  const resetWorkspace = useWorkspaceStore(s => s.resetWorkspace)
  const { query, setQuery, deferredQuery } = usePreferenceSearchState()

  const resetAllChanges = () => {
    resetPreferences()
    resetWorkspace()
  }

  return (
    <>
      <div className='sticky top-0 z-10 -mx-0.5 flex flex-col gap-2.5'>
        <PreferenceSearch value={query} onChange={setQuery} />

        <div className='flex flex-col gap-1.5'>
          <Button variant='dashed' status='primary' className='w-full' onClick={() => resetPixis()}>
            Restablecer configuración
          </Button>
          <Button variant='dashed' status='error' className='w-full' onClick={resetAllChanges}>
            Resetear cambios
          </Button>
        </div>
      </div>

      <PreferenceSearchProvider query={deferredQuery}>
        <div className='flex flex-col gap-5 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
          <Section groupId='chrome'>
            <WindowChromePreference />
          </Section>

          <Section groupId='pixis'>
            <SchemaPreferenceField fieldId='borderRadius' />
            <SchemaPreferenceField fieldId='containerBorderRadius' />
            <SchemaPreferenceField fieldId='containerHeight' />
            <SchemaPreferenceField fieldId='containerWidth' />
            <AspectRatioPreference />
            <SchemaPreferenceField fieldId='containerPadding' />
            <SchemaPreferenceField fieldId='exportScale' />
          </Section>

          {deferredQuery.trim() ? (
            <div
              data-preference-empty
              className='border-border/50 bg-card/30 flex flex-col items-center gap-1 rounded-md border border-dashed px-4 py-8 text-center'
            >
              <Typography.Emphasis className='leading-snug'>Sin resultados</Typography.Emphasis>
              <Typography.Paragraph tone='secondary' className='m-0 max-w-[16rem] leading-snug'>
                No hay preferencias que coincidan con “{deferredQuery.trim()}”.
              </Typography.Paragraph>
            </div>
          ) : null}
        </div>
      </PreferenceSearchProvider>
    </>
  )
}

export default SetterPixisPreferences
