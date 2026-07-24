import {
  type MonacoPreferenceFieldId,
  getDefaultMonacoState,
  monacoPreferenceFields,
  monacoPreferenceGroups
} from './preferences.monaco.config'
import {
  type PixisPreferenceFieldId,
  getDefaultPixisState,
  pixisPreferenceFields,
  pixisPreferenceGroups
} from './preferences.pixis.config'
import type { PreferenceGroup, PreferenceGroupId, PreferencesState } from './preferences.types'

export type {
  MonacoState,
  PixisState,
  PreferenceFieldDef,
  PreferenceFieldKind,
  PreferenceGroup,
  PreferenceGroupId,
  PreferencesState
} from './preferences.types'

export type { MonacoPreferenceFieldId } from './preferences.monaco.config'
export type { PixisPreferenceFieldId } from './preferences.pixis.config'
export { applyPixisDom } from './preferences.pixis.config'

export const preferencesConfig = {
  groups: [...pixisPreferenceGroups, ...monacoPreferenceGroups],
  fields: {
    ...pixisPreferenceFields,
    ...monacoPreferenceFields
  }
}

export type PreferenceFieldId = PixisPreferenceFieldId | MonacoPreferenceFieldId

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
