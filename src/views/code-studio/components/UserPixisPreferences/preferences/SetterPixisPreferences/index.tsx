import { PreferencePanel, PreferenceSection } from '@views/code-studio/components/preferences/PreferenceField'
import SchemaPreferenceField from '@views/code-studio/components/preferences/SchemaPreference'
import { getGroup } from '@views/code-studio/utils/preferences'
import { type FC, type ReactNode } from 'react'

import AspectRatioPreference from '../AspectRatioPreference'
import WindowChromePreference from '../WindowChromePreference'

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

const SetterPixisPreferences: FC = () => (
  <div className='flex flex-col gap-5'>
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
  </div>
)

export default SetterPixisPreferences
