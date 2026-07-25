import type { MonacoLanguage } from '@/shared/monaco-languages'

export type PixisPreferenceGroupId = 'pixis' | 'chrome'

export type WindowControlsStyle = 'mac' | 'windows' | 'none'
export type ChromeSide = 'left' | 'right'
export type TitleAlign = 'left' | 'center' | 'right'
export type MacTrafficPreset = 'classic' | 'graphite' | 'candy' | 'mono'
export type HeaderDensity = 'compact' | 'comfortable' | 'tall'
export type HeaderTint = 'none' | 'subtle' | 'solid'
export type TabStyle = 'soft' | 'underline' | 'browser'
export type StatusBarDensity = 'compact' | 'full'
export type BreadcrumbSeparator = '/' | '>' | '›' | '·'

export type PixisChromeState = {
  controls: WindowControlsStyle
  controlsSide: ChromeSide
  titleAlign: TitleAlign
  macColors: MacTrafficPreset
  headerDensity: HeaderDensity
  headerTint: HeaderTint
  headerAccent: boolean
  breadcrumb: boolean
  breadcrumbSeparator: BreadcrumbSeparator
  statusBar: boolean
  statusBarDensity: StatusBarDensity
  activityBar: boolean
  fileExplorer: boolean
  explorerWidthPx: number
  tabStyle: TabStyle
  tabBadges: boolean
  showTabAdd: boolean
}

export type PixisState = {
  language: MonacoLanguage
  typography: string
  borderRadius: number
  containerWidth: number
  containerHeight: number
  containerPadding: number
  containerBorderRadius: number
  aspectRatio: string
  exportScale: number
  chrome: PixisChromeState
}
