import Button from '@/shared/ui/Button'
import Typography from '@common/ui/Typography'
import {
  PreferencePanel,
  PreferenceSearchProvider,
  PreferenceSection
} from '@views/code-studio/components/preferences/PreferenceField'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import SchemaPreferenceField from '@views/code-studio/components/preferences/SchemaPreference'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { getGroup } from '@views/code-studio/utils/preferences.config'
import { type FC, type ReactNode } from 'react'

import MinimapPreference from '../MinimapPreference'
import ScrollPreference from '../ScrollPreference'
import StickyScrollPreference from '../StickyScrollPreference'

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

const SetterMonacoPreferences: FC = () => {
  const resetMonaco = usePixisPreferencesStore(s => s.resetMonaco)
  const { resetTheme } = useMonacoThemeStore()
  const { query, setQuery, deferredQuery } = usePreferenceSearchState()

  return (
    <>
      <div className='sticky top-0 z-10 -mx-0.5 flex flex-col gap-2.5'>
        <PreferenceSearch value={query} onChange={setQuery} />

        <Button
          variant='dashed'
          status='primary'
          className='w-full'
          onClick={() => {
            resetMonaco()
            resetTheme()
          }}
        >
          Restablecer configuración
        </Button>
      </div>

      <PreferenceSearchProvider query={deferredQuery}>
        <div className='flex flex-col gap-5 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
          <Section groupId='visual'>
            <SchemaPreferenceField fieldId='glyphMargin' />
            <SchemaPreferenceField fieldId='renderValidationDecorations' />
            <SchemaPreferenceField fieldId='lineNumbers' />
            <SchemaPreferenceField fieldId='wordWrap' />
            <SchemaPreferenceField fieldId='wordWrapColumn' />
            <SchemaPreferenceField fieldId='wrappingIndent' />
            <SchemaPreferenceField fieldId='renderLineHighlight' />
          </Section>

          <Section groupId='typography'>
            <SchemaPreferenceField fieldId='fontSize' />
            <SchemaPreferenceField fieldId='letterSpacing' />
            <SchemaPreferenceField fieldId='fontLigatures' />
            <SchemaPreferenceField fieldId='lineHeight' />
          </Section>

          <MinimapPreference />
          <ScrollPreference />
          <StickyScrollPreference />

          <Section groupId='cursor'>
            <SchemaPreferenceField fieldId='cursorBlinking' />
            <SchemaPreferenceField fieldId='cursorStyle' />
            <SchemaPreferenceField fieldId='mouseStyle' />
            <SchemaPreferenceField fieldId='hideCursorInOverviewRuler' />
          </Section>

          <Section groupId='editor'>
            <SchemaPreferenceField fieldId='folding' />
            <SchemaPreferenceField fieldId='scrollBeyondLastLine' />
            <SchemaPreferenceField fieldId='formatOnPaste' />
            <SchemaPreferenceField fieldId='formatOnType' />
            <SchemaPreferenceField fieldId='matchBrackets' />
            <SchemaPreferenceField fieldId='autoClosingBrackets' />
            <SchemaPreferenceField fieldId='autoClosingQuotes' />
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

export default SetterMonacoPreferences
