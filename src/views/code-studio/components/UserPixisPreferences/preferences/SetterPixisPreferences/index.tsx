import Button from '@/shared/ui/Button'
import Typography from '@common/ui/Typography'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { getGroup } from '@views/code-studio/utils/preferences.config'
import { type FC, type ReactNode } from 'react'

import {
  PreferencePanel,
  PreferenceSearchProvider,
  PreferenceSection
} from '../../../UserMonacoPreferences/preferences/PreferenceField'
import { PreferenceSearch, usePreferenceSearchState } from '../../../UserMonacoPreferences/preferences/PreferenceSearch'
import SchemaPreferenceField from '../../../UserMonacoPreferences/preferences/SchemaPreference'
import AspectRatioPreference from '../AspectRatioPreference'

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
  const { query, setQuery, deferredQuery } = usePreferenceSearchState()

  return (
    <>
      <div className='sticky top-0 z-10 -mx-0.5 flex flex-col gap-2.5'>
        <PreferenceSearch value={query} onChange={setQuery} />

        <Button variant='dashed' status='primary' className='w-full' onClick={() => resetPixis()}>
          Restablecer configuración
        </Button>
      </div>

      <PreferenceSearchProvider query={deferredQuery}>
        <div className='flex flex-col gap-5 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
          <Section groupId='pixis'>
            <SchemaPreferenceField fieldId='showLanguageIcon' />
            <SchemaPreferenceField fieldId='shadowLanguage' />
            <SchemaPreferenceField fieldId='borderRadius' />
            <SchemaPreferenceField fieldId='containerBorderRadius' />
            <SchemaPreferenceField fieldId='containerHeight' />
            <SchemaPreferenceField fieldId='containerWidth' />
            <AspectRatioPreference />
            <SchemaPreferenceField fieldId='containerPadding' />
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
