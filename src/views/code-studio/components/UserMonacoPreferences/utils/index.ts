export type {
  HighlightLinesDiffView,
  HighlightLinesState,
  HighlightLinesStyle,
  MonacoPreferenceGroupId,
  MonacoState
} from './types'

export {
  getDefaultMonacoState,
  monacoPreferenceFields,
  monacoPreferenceGroups,
  parseHighlightLineRanges,
  type MonacoPreferenceFieldId
} from './monaco.config'

export { buildHighlightLineDecorations } from './highlightLines.decorations'
