import {
  getDefaultMonacoState,
  monacoPreferenceFields,
  monacoPreferenceGroups,
  type MonacoPreferenceFieldId
} from '@views/code-studio/components/UserMonacoPreferences/utils'
import {
  getDefaultPixisState,
  pixisPreferenceFields,
  pixisPreferenceGroups,
  type PixisPreferenceFieldId
} from '@views/code-studio/components/UserPixisPreferences/utils'

import type { PreferenceGroup, PreferenceGroupId, PreferencesState } from './types'

export type * from './types'

export type PreferenceFieldId = PixisPreferenceFieldId | MonacoPreferenceFieldId

export const preferencesConfig = {
  groups: [...pixisPreferenceGroups, ...monacoPreferenceGroups],
  fields: {
    ...pixisPreferenceFields,
    ...monacoPreferenceFields
  }
}

export const getField = <K extends PreferenceFieldId>(id: K) =>
  preferencesConfig.fields[id] as (typeof preferencesConfig.fields)[K]

export const getGroup = (groupId: PreferenceGroupId): PreferenceGroup => {
  const group = preferencesConfig.groups.find(item => item.id === groupId)
  if (!group) throw new Error(`Unknown preference group: ${groupId}`)
  return group
}

export const getDefaultState = (): PreferencesState => ({
  pixis: getDefaultPixisState(),
  monaco: getDefaultMonacoState()
})
