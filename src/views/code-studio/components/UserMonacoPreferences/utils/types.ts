import type { editor } from 'monaco-editor'

type Monaco = editor.IEditorOptions

export type MonacoPreferenceGroupId =
  | 'visual'
  | 'typography'
  | 'minimap'
  | 'scrollbar'
  | 'stickyScroll'
  | 'cursor'
  | 'editor'
  | 'highlightLines'

export type HighlightLinesStyle = 'amber' | 'blue' | 'green' | 'pink' | 'purple'
export type HighlightLinesDiffView = 'off' | 'sideBySide' | 'inline'

export type HighlightLinesState = {
  enabled: boolean
  ranges: string
  showGutterBar: boolean
  style: HighlightLinesStyle
  overviewRuler: boolean
  diffView: HighlightLinesDiffView
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
