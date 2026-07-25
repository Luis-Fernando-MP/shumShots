export {
  createKeywordGroup,
  getDefaultMonacoState,
  monacoPreferenceFields,
  monacoPreferenceGroups,
  parseHighlightLineRanges,
  parseKeywordTerms,
  type MonacoPreferenceFieldId
} from './monaco.config'

export { buildHighlightLineDecorations } from './highlightLines.decorations'
export {
  buildKeywordDecorations,
  ensureKeywordGlyphStyles,
  KEYWORD_GLYPHS
} from './keywordHighlight.decorations'
