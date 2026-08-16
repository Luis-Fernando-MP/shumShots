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

const PixisFields = () => (
  <>
    <SchemaPreferenceField fieldId='borderRadius' />
    <SchemaPreferenceField fieldId='containerBorderRadius' />
    <AspectRatioPreference />
    <SchemaPreferenceField fieldId='containerPadding' />
    <SchemaPreferenceField fieldId='exportScale' />
  </>
)

const SetterPixisPreferences: FC<{ groupId?: 'chrome' | 'pixis' }> = ({ groupId }) => (
  <div className='flex flex-col gap-6'>
    {groupId === 'chrome' && <WindowChromePreference />}
    {!groupId && (
      <Section groupId='chrome'>
        <WindowChromePreference />
      </Section>
    )}

    {groupId === 'pixis' && <PixisFields />}
    {!groupId && (
      <Section groupId='pixis'>
        <PixisFields />
      </Section>
    )}
  </div>
)

export default SetterPixisPreferences
