import type { MonacoLanguage } from '@/shared/monaco-languages'
import type { editor } from 'monaco-editor'

type Monaco = editor.IEditorOptions

export type PreferenceGroupId =
  | 'pixis'
  | 'visual'
  | 'typography'
  | 'minimap'
  | 'scrollbar'
  | 'stickyScroll'
  | 'cursor'
  | 'editor'

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

export type PixisState = {
  language: MonacoLanguage
  typography: string
  showLanguageIcon: boolean
  shadowLanguage: boolean
  borderRadius: number
  containerWidth: number
  containerHeight: number
  containerPadding: number
  containerBorderRadius: number
  aspectRatio: string
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
}

export type PreferencesState = {
  pixis: PixisState
  monaco: MonacoState
}
