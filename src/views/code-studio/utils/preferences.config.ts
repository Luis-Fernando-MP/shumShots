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
  BreadcrumbSeparator,
  ChromeSide,
  HeaderDensity,
  HeaderTint,
  MacTrafficPreset,
  MonacoState,
  PixisChromeState,
  PixisState,
  PreferenceFieldDef,
  PreferenceFieldKind,
  PreferenceGroup,
  PreferenceGroupId,
  PreferencesState,
  StatusBarDensity,
  TabStyle,
  TitleAlign,
  WindowControlsStyle
} from './preferences.types'

export type { MonacoPreferenceFieldId } from './preferences.monaco.config'
export { getDefaultMonacoState } from './preferences.monaco.config'
export type { PixisPreferenceFieldId } from './preferences.pixis.config'
export {
  BREADCRUMB_SEPARATORS,
  CHROME_LOOK_PRESETS,
  EXPLORER_WIDTH_DEFAULT,
  EXPLORER_WIDTH_MAX,
  EXPLORER_WIDTH_MIN,
  HEADER_DENSITY_PX,
  MAC_TRAFFIC_PRESETS,
  applyPixisDom,
  chromeDefaults,
  getDefaultPixisState,
  matchesChromePreset
} from './preferences.pixis.config'

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
