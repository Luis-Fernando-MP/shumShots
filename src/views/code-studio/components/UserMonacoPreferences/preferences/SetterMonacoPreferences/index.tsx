import {
  PreferencePanel,
  PreferenceSearchProvider,
  PreferenceSection
} from '@views/code-studio/components/preferences/PreferenceField'
import SchemaPreferenceField from '@views/code-studio/components/preferences/SchemaPreference'
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

interface SetterMonacoPreferencesProps {
  query: string
}

const SetterMonacoPreferences: FC<SetterMonacoPreferencesProps> = ({ query }) => {
  return (
    <PreferenceSearchProvider query={query}>
      <div className='flex flex-col gap-5'>
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
      </div>
    </PreferenceSearchProvider>
  )
}

export default SetterMonacoPreferences
