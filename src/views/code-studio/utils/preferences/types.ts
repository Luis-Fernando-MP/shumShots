import type { MonacoLanguage } from '@/shared/monaco-languages'
import type { editor } from 'monaco-editor'

type Monaco = editor.IEditorOptions

export type PixisPreferenceGroupId = 'pixis' | 'chrome'

export type MonacoPreferenceGroupId =
  | 'visual'
  | 'typography'
  | 'minimap'
  | 'scrollbar'
  | 'stickyScroll'
  | 'cursor'
  | 'editor'
  | 'highlightLines'

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

export type WindowControlsStyle = 'mac' | 'windows' | 'none'
export type ChromeSide = 'left' | 'right'
export type TitleAlign = 'left' | 'center' | 'right'
export type MacTrafficPreset = 'classic' | 'graphite' | 'candy' | 'mono'
export type HeaderDensity = 'compact' | 'comfortable' | 'tall'
export type HeaderTint = 'none' | 'subtle' | 'solid'
export type TabStyle = 'soft' | 'underline' | 'browser'
export type StatusBarDensity = 'compact' | 'full'
export type BreadcrumbSeparator = '/' | '>' | '›' | '·'

export type HighlightLinesStyle = 'amber' | 'blue' | 'green' | 'pink' | 'purple'
export type HighlightLinesDiffView = 'off' | 'sideBySide' | 'inline'

export type HighlightLinesState = {
  enabled: boolean
  ranges: string
  showGutterBar: boolean
  style: HighlightLinesStyle
  overviewRuler: boolean
  diffView: HighlightLinesDiffView
  showWhitespace: boolean
}

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

export type MonacoState = {
  lineNumbers: Monaco['lineNumbers']
  minimap: Monaco['minimap']
  fontLigatures: Monaco['fontLigatures']
  wordWrap: Monaco['wordWrap']
  wordWrapColumn: Monaco['wordWrapColumn']
  fontSize: Monaco['fontSize']
  lineHeight: Monaco['lineHeight']
  stickyScroll: Monaco['stickyScroll']
  cursorBlinking: Monaco['cursorBlinking']
  mouseStyle: Monaco['mouseStyle']
  cursorStyle: Monaco['cursorStyle']
  wrappingIndent: Monaco['wrappingIndent']
  folding: Monaco['folding']
  letterSpacing: Monaco['letterSpacing']
  autoClosingBrackets: Monaco['autoClosingBrackets']
  autoClosingQuotes: Monaco['autoClosingQuotes']
  formatOnPaste: Monaco['formatOnPaste']
  formatOnType: Monaco['formatOnType']
  scrollBeyondLastLine: Monaco['scrollBeyondLastLine']
  renderLineHighlight: Monaco['renderLineHighlight']
  scrollbar: Monaco['scrollbar']
  glyphMargin: Monaco['glyphMargin']
  renderValidationDecorations: Monaco['renderValidationDecorations']
  hideCursorInOverviewRuler: Monaco['hideCursorInOverviewRuler']
  matchBrackets: Monaco['matchBrackets']
  highlightLines: HighlightLinesState
}

export type PreferencesState = {
  pixis: PixisState
  monaco: MonacoState
}
