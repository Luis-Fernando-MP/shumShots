import type { MonacoPreferenceGroupId, MonacoState } from '@views/code-studio/components/UserMonacoPreferences/utils/types'
import type {
  PixisChromeState,
  PixisPreferenceGroupId,
  PixisState
} from '@views/code-studio/components/UserPixisPreferences/utils/types'

export type PreferenceGroupId = PixisPreferenceGroupId | MonacoPreferenceGroupId
export type PreferenceFieldKind = 'boolean' | 'number' | 'string' | 'custom'

export type PreferenceGroup = {
  id: PreferenceGroupId
  title: string
  subtitle?: string
  panel?: boolean
}

export type PreferenceFieldDef<T = unknown> = {
  id: string
  groupId: PreferenceGroupId
  path: string
  kind: PreferenceFieldKind
  title: string
  subtitle?: string
  description?: string
  example?: string
  note?: string
  default: T
  options?: readonly T[]
  min?: number
  max?: number
  step?: number
  suffix?: string
}

export type PreferencesState = {
  pixis: PixisState
  monaco: MonacoState
}

export type { MonacoState, PixisState, PixisChromeState }
