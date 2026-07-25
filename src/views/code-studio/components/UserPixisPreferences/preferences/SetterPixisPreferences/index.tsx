import {
  PreferencePanel,
  PreferenceSearchProvider,
  PreferenceSection
} from '@views/code-studio/components/preferences/PreferenceField'
import SchemaPreferenceField from '@views/code-studio/components/preferences/SchemaPreference'
import { getGroup } from '@views/code-studio/utils/preferences'
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

interface SetterPixisPreferencesProps {
  query: string
}

const SetterPixisPreferences: FC<SetterPixisPreferencesProps> = ({ query }) => {
  return (
    <PreferenceSearchProvider query={query}>
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
    </PreferenceSearchProvider>
  )
}

export default SetterPixisPreferences
