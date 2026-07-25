import { parseHighlightLineRanges } from './monaco.config'
import type { HighlightLinesState, HighlightLinesStyle } from './types'

const OVERVIEW_RULER_CENTER = 2

type HighlightDecoration = {
  range: {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }
  options: {
    isWholeLine: true
    className: string
    lineNumberClassName: string
    overviewRuler?: {
      color: string
      position: number
    }
  }
}

const STYLE_RULER: Record<HighlightLinesStyle, string> = {
  amber: '#e5c07b',
  blue: '#61afef',
  green: '#98c379',
  pink: '#c678dd',
  purple: '#a78bfa'
}

export const buildHighlightLineDecorations = (
  state: HighlightLinesState,
  lineCount: number
): HighlightDecoration[] => {
  if (!state.enabled || state.diffView !== 'off' || lineCount < 1) return []

  const rulerColor = STYLE_RULER[state.style]
  const tone = state.style
  const decorations: HighlightDecoration[] = []

  for (const { start, end } of parseHighlightLineRanges(state.ranges)) {
    const from = Math.min(start, lineCount)
    const to = Math.min(end, lineCount)
    if (from < 1 || to < from) continue

    decorations.push({
      range: {
        startLineNumber: from,
        startColumn: 1,
        endLineNumber: to,
        endColumn: 1
      },
      options: {
        isWholeLine: true,
        className: `pixis-line-highlight pixis-hl-${tone}`,
        lineNumberClassName: [
          'pixis-line-highlight-number',
          `pixis-hl-${tone}`,
          state.showGutterBar ? 'pixis-line-highlight-bar' : ''
        ]
          .filter(Boolean)
          .join(' '),
        overviewRuler: state.overviewRuler
          ? {
              color: rulerColor,
              position: OVERVIEW_RULER_CENTER
            }
          : undefined
      }
    })
  }

  return decorations
}
