import type {
  HighlightLinesState,
  KeywordHighlightGroup,
  KeywordHighlightState,
  MonacoState,
  PreferenceFieldDef,
  PreferenceGroup
} from '@views/code-studio/utils/preferences/types'

const highlightLinesDefaults = {
  enabled: false,
  ranges: '11-13',
  showGutterBar: true,
  style: 'amber',
  overviewRuler: true,
  diffView: 'off',
  showWhitespace: true
} satisfies HighlightLinesState

export const createKeywordGroup = (
  partial: Partial<KeywordHighlightGroup> = {}
): KeywordHighlightGroup => ({
  id: partial.id ?? `kw-${crypto.randomUUID()}`,
  terms: partial.terms ?? '',
  style: partial.style ?? 'primary',
  glyph: partial.glyph ?? 'logo'
})

const keywordHighlightDefaults = {
  groups: [
    createKeywordGroup({ id: 'pixis', terms: 'pixis', style: 'primary', glyph: 'logo' }),
    createKeywordGroup({ id: 'haui', terms: 'haui', style: 'amber', glyph: 'logo' })
  ]
} satisfies KeywordHighlightState

const monacoDefaults = {
  glyphMargin: false,
  renderValidationDecorations: 'off',
  lineNumbers: 'on',
  wordWrap: 'wordWrapColumn',
  wordWrapColumn: 80,
  wrappingIndent: 'indent',
  renderLineHighlight: 'none',
  fontSize: 14,
  letterSpacing: 0,
  fontLigatures: true,
  lineHeight: 22,
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
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
    useShadows: false,
    handleMouseWheel: true,
    horizontalScrollbarSize: 10,
    verticalScrollbarSize: 10,
    ignoreHorizontalScrollbarInContentHeight: false
  },
  stickyScroll: {
    enabled: false,
    maxLineCount: 5,
    defaultModel: 'outlineModel',
    scrollWithEditor: true
  },
  cursorBlinking: 'expand',
  cursorStyle: 'line',
  mouseStyle: 'default',
  hideCursorInOverviewRuler: true,
  folding: true,
  scrollBeyondLastLine: false,
  formatOnPaste: true,
  formatOnType: true,
  matchBrackets: 'never',
  autoClosingBrackets: 'beforeWhitespace',
  autoClosingQuotes: 'beforeWhitespace',
  highlightLines: highlightLinesDefaults,
  keywordHighlight: keywordHighlightDefaults
} satisfies MonacoState

export const getDefaultMonacoState = (): MonacoState => structuredClone(monacoDefaults)

const field = <T>(def: PreferenceFieldDef<T>) => def

export const monacoPreferenceGroups = [
  {
    id: 'visual',
    title: 'Visual',
    subtitle: 'Aspecto del editor: márgenes, wrap y resaltados.'
  },
  {
    id: 'typography',
    title: 'Tipografía',
    subtitle: 'Tamaño, ritmo y detalle tipográfico del código.'
  },
  {
    id: 'highlightLines',
    title: 'Resaltar líneas',
    subtitle: 'Rangos en editor normal, o Diff Editor (paralelo / inline).'
  },
  {
    id: 'keywordHighlight',
    title: 'Palabras clave',
    subtitle: 'Términos resaltados e iconos en el margen glyph.'
  },
  {
    id: 'minimap',
    title: 'Minimapa',
    subtitle: 'Vista previa compacta del archivo a un lado.'
  },
  {
    id: 'scrollbar',
    title: 'Barra de Scroll',
    subtitle: 'Visibilidad y tamaño de las barras del editor.'
  },
  {
    id: 'stickyScroll',
    title: 'Scroll pegajoso',
    subtitle: 'Mantiene el encabezado del bloque visible al hacer scroll.'
  },
  {
    id: 'cursor',
    title: 'Cursor',
    subtitle: 'Forma, parpadeo y comportamiento del caret.'
  },
  {
    id: 'editor',
    title: 'Editor',
    subtitle: 'Comportamiento al editar, plegar y auto-cerrar.'
  }
] satisfies PreferenceGroup[]

export const monacoPreferenceFields = {
  renderValidationDecorations: field({
    id: 'renderValidationDecorations',
    groupId: 'visual',
    path: 'monaco.renderValidationDecorations',
    kind: 'string',
    title: 'Validación de código',
    subtitle: 'Subrayado de errores',
    description: 'Muestra avisos de sintaxis que Monaco detecte.',
    note: 'Solo lenguajes con soporte de validación.',
    default: monacoDefaults.renderValidationDecorations,
    options: ['editable', 'on', 'off']
  }),
  lineNumbers: field({
    id: 'lineNumbers',
    groupId: 'visual',
    path: 'monaco.lineNumbers',
    kind: 'string',
    title: 'Números de línea',
    subtitle: 'Cómo se numeran las filas',
    example: 'Ej: relative = distancia al cursor (1, 2, 3...)',
    default: monacoDefaults.lineNumbers,
    options: ['on', 'off', 'relative', 'interval']
  }),
  wordWrap: field({
    id: 'wordWrap',
    groupId: 'visual',
    path: 'monaco.wordWrap',
    kind: 'string',
    title: 'Salto de línea',
    subtitle: 'Wrap del texto largo',
    example: 'Ej: on = siempre; wordWrapColumn = al llegar a la columna',
    default: monacoDefaults.wordWrap,
    options: ['on', 'off', 'wordWrapColumn', 'bounded']
  }),
  wordWrapColumn: field({
    id: 'wordWrapColumn',
    groupId: 'visual',
    path: 'monaco.wordWrapColumn',
    kind: 'number',
    title: 'Columna de salto',
    subtitle: 'Ancho máximo antes del wrap',
    example: 'Ej: 80 ≈ ancho clásico de terminal',
    note: 'Solo aplica con wordWrapColumn o bounded.',
    default: monacoDefaults.wordWrapColumn,
    options: [50, 60, 70, 80, 90, 100, 110, 120],
    min: 10,
    max: 200,
    step: 10
  }),
  wrappingIndent: field({
    id: 'wrappingIndent',
    groupId: 'visual',
    path: 'monaco.wrappingIndent',
    kind: 'string',
    title: 'Sangría al saltar',
    subtitle: 'Indent de las líneas wrappeadas',
    example: 'Ej: indent = respeta el nivel; deepIndent = un nivel más',
    note: 'Requiere salto de línea activo.',
    default: monacoDefaults.wrappingIndent,
    options: ['none', 'indent', 'deepIndent']
  }),
  renderLineHighlight: field({
    id: 'renderLineHighlight',
    groupId: 'visual',
    path: 'monaco.renderLineHighlight',
    kind: 'string',
    title: 'Resaltado de línea',
    subtitle: 'Marca dónde está el cursor',
    example: 'Ej: gutter = solo el margen; full = fila completa',
    note: 'La intensidad depende del tema.',
    default: monacoDefaults.renderLineHighlight,
    options: ['none', 'gutter', 'line', 'full']
  }),

  fontSize: field({
    id: 'fontSize',
    groupId: 'typography',
    path: 'monaco.fontSize',
    kind: 'number',
    title: 'Tamaño de fuente',
    subtitle: 'Escala del código',
    example: 'Ej: Normal = 14px',
    default: monacoDefaults.fontSize,
    options: [10, 14, 16, 18, 20],
    min: 10,
    max: 22,
    step: 1,
    suffix: 'px'
  }),
  letterSpacing: field({
    id: 'letterSpacing',
    groupId: 'typography',
    path: 'monaco.letterSpacing',
    kind: 'number',
    title: 'Espaciado entre letras',
    subtitle: 'Tracking del texto',
    example: 'Ej: 0 = normal; valores altos abren el código',
    default: monacoDefaults.letterSpacing,
    options: [-1, -0.5, 0, 0.5, 1, 2, 3]
  }),
  fontLigatures: field({
    id: 'fontLigatures',
    groupId: 'typography',
    path: 'monaco.fontLigatures',
    kind: 'boolean',
    title: 'Ligaduras',
    subtitle: 'Une operadores en un solo glifo',
    example: 'Ej: => !== >= se ven como un símbolo',
    note: 'Depende de la tipografía elegida.',
    default: monacoDefaults.fontLigatures,
    options: [true, false]
  }),
  lineHeight: field({
    id: 'lineHeight',
    groupId: 'typography',
    path: 'monaco.lineHeight',
    kind: 'number',
    title: 'Altura entre líneas',
    subtitle: 'Line-height del editor',
    example: 'Ej: Normal = 22px',
    default: monacoDefaults.lineHeight,
    options: [18, 20, 22, 24, 26, 28],
    min: 8,
    max: 32,
    step: 2,
    suffix: 'px'
  }),

  cursorBlinking: field({
    id: 'cursorBlinking',
    groupId: 'cursor',
    path: 'monaco.cursorBlinking',
    kind: 'string',
    title: 'Parpadeo',
    subtitle: 'Animación del cursor',
    example: 'Ej: solid = sin parpadear; smooth = fundido',
    default: monacoDefaults.cursorBlinking,
    options: ['blink', 'smooth', 'phase', 'expand', 'solid']
  }),
  cursorStyle: field({
    id: 'cursorStyle',
    groupId: 'cursor',
    path: 'monaco.cursorStyle',
    kind: 'string',
    title: 'Estilo',
    subtitle: 'Forma visual del caret',
    example: 'Ej: block = caja; line-thin = barra fina',
    default: monacoDefaults.cursorStyle,
    options: ['block', 'block-outline', 'underline', 'underline-thin', 'line', 'line-thin']
  }),
  mouseStyle: field({
    id: 'mouseStyle',
    groupId: 'cursor',
    path: 'monaco.mouseStyle',
    kind: 'string',
    title: 'Cursor del mouse',
    subtitle: 'Pointer al pasar sobre el editor',
    example: 'Ej: text = I-beam; copy = indicador de copiar',
    default: monacoDefaults.mouseStyle,
    options: ['default', 'copy', 'text']
  }),
  hideCursorInOverviewRuler: field({
    id: 'hideCursorInOverviewRuler',
    groupId: 'cursor',
    path: 'monaco.hideCursorInOverviewRuler',
    kind: 'boolean',
    title: 'Ruler de overview',
    subtitle: 'Cursor en la barra derecha',
    description: 'Si está On, oculta el caret en el overview ruler.',
    default: monacoDefaults.hideCursorInOverviewRuler,
    options: [true, false]
  }),

  folding: field({
    id: 'folding',
    groupId: 'editor',
    path: 'monaco.folding',
    kind: 'boolean',
    title: 'Plegado de código',
    subtitle: 'Fold de bloques',
    description: 'Permite colapsar funciones, clases y regiones.',
    default: monacoDefaults.folding,
    options: [true, false]
  }),
  scrollBeyondLastLine: field({
    id: 'scrollBeyondLastLine',
    groupId: 'editor',
    path: 'monaco.scrollBeyondLastLine',
    kind: 'boolean',
    title: 'Scroll extra',
    subtitle: 'Espacio bajo la última línea',
    description: 'Deja margen vacío al final para bajar el foco.',
    default: monacoDefaults.scrollBeyondLastLine,
    options: [true, false]
  }),
  formatOnPaste: field({
    id: 'formatOnPaste',
    groupId: 'editor',
    path: 'monaco.formatOnPaste',
    kind: 'boolean',
    title: 'Formatear al pegar',
    subtitle: 'Auto-format on paste',
    example: 'Ej: pegas un bloque y se indenta solo',
    default: monacoDefaults.formatOnPaste,
    options: [true, false]
  }),
  formatOnType: field({
    id: 'formatOnType',
    groupId: 'editor',
    path: 'monaco.formatOnType',
    kind: 'boolean',
    title: 'Formatear al escribir',
    subtitle: 'Auto-format on type',
    example: 'Ej: al cerrar } se reordena el bloque',
    default: monacoDefaults.formatOnType,
    options: [true, false]
  }),
  matchBrackets: field({
    id: 'matchBrackets',
    groupId: 'editor',
    path: 'monaco.matchBrackets',
    kind: 'string',
    title: 'Match de paréntesis',
    subtitle: 'Resalta el cierre emparejado',
    example: 'Ej: near = solo si está cerca; always = siempre',
    default: monacoDefaults.matchBrackets,
    options: ['never', 'near', 'always']
  }),
  autoClosingBrackets: field({
    id: 'autoClosingBrackets',
    groupId: 'editor',
    path: 'monaco.autoClosingBrackets',
    kind: 'string',
    title: 'Auto-cierre de brackets',
    subtitle: '(), [], {} al escribir',
    example: 'Ej: escribes ( y aparece )',
    default: monacoDefaults.autoClosingBrackets,
    options: ['always', 'beforeWhitespace', 'languageDefined', 'never']
  }),
  autoClosingQuotes: field({
    id: 'autoClosingQuotes',
    groupId: 'editor',
    path: 'monaco.autoClosingQuotes',
    kind: 'string',
    title: 'Auto-cierre de comillas',
    subtitle: `" " y ' ' al escribir`,
    example: 'Ej: languageDefined = según el lenguaje',
    default: monacoDefaults.autoClosingQuotes,
    options: ['always', 'beforeWhitespace', 'languageDefined', 'never']
  })
}

export type MonacoPreferenceFieldId = keyof typeof monacoPreferenceFields

export const parseKeywordTerms = (input: string): string[] => {
  const seen = new Set<string>()
  const terms: string[] = []
  for (const part of input.split(',')) {
    const term = part.trim()
    if (!term) continue
    const key = term.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    terms.push(term)
  }
  return terms
}

export const parseHighlightLineRanges = (input: string): { start: number; end: number }[] => {
  const ranges: { start: number; end: number }[] = []
  for (const part of input.split(/[,;\s]+/)) {
    const token = part.trim()
    if (!token) continue
    const span = /^(\d+)\s*[-–—:]\s*(\d+)$/.exec(token)
    if (span) {
      const a = Number(span[1])
      const b = Number(span[2])
      if (!Number.isFinite(a) || !Number.isFinite(b) || a < 1 || b < 1) continue
      ranges.push({ start: Math.min(a, b), end: Math.max(a, b) })
      continue
    }
    const single = /^(\d+)$/.exec(token)
    if (single) {
      const line = Number(single[1])
      if (!Number.isFinite(line) || line < 1) continue
      ranges.push({ start: line, end: line })
    }
  }
  return ranges
}
