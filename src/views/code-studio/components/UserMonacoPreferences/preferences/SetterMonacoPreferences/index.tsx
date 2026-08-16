import { PreferencePanel, PreferenceSection } from '@views/code-studio/components/preferences/PreferenceField'
import SchemaPreferenceField from '@views/code-studio/components/preferences/SchemaPreference'
import { getGroup } from '@views/code-studio/utils/preferences'
import { type FC, type ReactNode } from 'react'

import HighlightLinesPreference from '../HighlightLinesPreference'
import KeywordHighlightPreference from '../KeywordHighlightPreference'
import MinimapPreference from '../MinimapPreference'
import ScrollPreference from '../ScrollPreference'
import StickyScrollPreference from '../StickyScrollPreference'

const Section = ({
  groupId,
  children
}: {
  groupId: Parameters<typeof getGroup>[0]
  children: ReactNode
}) => {
  const group = getGroup(groupId)
  const body = (
    <PreferenceSection title={group.title} subtitle={group.subtitle}>
      {children}
    </PreferenceSection>
  )
  return group.panel ? <PreferencePanel>{body}</PreferencePanel> : body
}

const SetterMonacoPreferences: FC = () => (
  <div className='flex flex-col gap-6'>
    <Section groupId='visual'>
      <SchemaPreferenceField fieldId='renderValidationDecorations' />
      <SchemaPreferenceField fieldId='lineNumbers' />
      <SchemaPreferenceField fieldId='wordWrap' />
      <PreferencePanel>
        <SchemaPreferenceField fieldId='wordWrapColumn' />
        <SchemaPreferenceField fieldId='wrappingIndent' />
      </PreferencePanel>
      <SchemaPreferenceField fieldId='renderLineHighlight' />
    </Section>

    <Section groupId='typography'>
      <SchemaPreferenceField fieldId='fontSize' />
      <SchemaPreferenceField fieldId='letterSpacing' />
      <SchemaPreferenceField fieldId='fontLigatures' />
      <SchemaPreferenceField fieldId='lineHeight' />
    </Section>

    <HighlightLinesPreference />
    <KeywordHighlightPreference />
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
      <PreferencePanel>
        <SchemaPreferenceField fieldId='formatOnPaste' />
        <SchemaPreferenceField fieldId='formatOnType' />
      </PreferencePanel>
      <SchemaPreferenceField fieldId='matchBrackets' />
      <PreferencePanel>
        <SchemaPreferenceField fieldId='autoClosingBrackets' />
        <SchemaPreferenceField fieldId='autoClosingQuotes' />
      </PreferencePanel>
    </Section>
  </div>
)

export default SetterMonacoPreferences
