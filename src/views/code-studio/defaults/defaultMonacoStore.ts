import { editor } from 'monaco-editor'

type Monaco = editor.IEditorOptions

export interface DefaultMonacoStore {
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
export const defaultMonacoStore: DefaultMonacoStore = {
  // Edición
  autoClosingBrackets: 'beforeWhitespace',
  autoClosingQuotes: 'beforeWhitespace',
  folding: true,
  formatOnPaste: true,
  formatOnType: true,
  matchBrackets: 'never',
  wordWrap: 'wordWrapColumn',
  wordWrapColumn: 80,
  wrappingIndent: 'indent',

  // Tipografía
  lineNumbers: 'on',
  renderLineHighlight: 'none',
  letterSpacing: 0,

  // Visual
  fontLigatures: true,
  fontSize: 14,
  lineHeight: 22,

  // Minimap
  minimap: {
    enabled: false,
    autohide: false,
    side: 'right',
    size: 'proportional',
    showSlider: 'always',
    renderCharacters: true,
    maxColumn: 100,
    scale: 1
  },

  // Barras de Desplazamiento
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
    useShadows: false,
    handleMouseWheel: true,
    horizontalScrollbarSize: 10,
    verticalScrollbarSize: 10,
    ignoreHorizontalScrollbarInContentHeight: false
  },

  // Desplazamiento Pegajoso
  stickyScroll: {
    enabled: false,
    maxLineCount: 5,
    defaultModel: 'outlineModel',
    scrollWithEditor: true
  },

  // Cursor
  cursorBlinking: 'expand',
  mouseStyle: 'default',
  cursorStyle: 'line',

  // Avanzado
  // Margen y Validaciones

  glyphMargin: false,
  hideCursorInOverviewRuler: true,
  renderValidationDecorations: 'off',
  scrollBeyondLastLine: false
}
