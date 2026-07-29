export const TABS_SCOPES = {
  corner: 'corner',
  frame: 'frame',
  shadow: 'shadow',
  size: 'size'
} as const

export type TabScope = (typeof TABS_SCOPES)[keyof typeof TABS_SCOPES]

export const ALL_TAB_SCOPES = Object.values(TABS_SCOPES)
