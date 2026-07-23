import { editor } from 'monaco-editor'
import { StateCreator, create } from 'zustand'

import { DefaultMonacoStore, defaultMonacoStore } from '../defaults/defaultMonacoStore'

type Monaco = editor.IEditorOptions

interface Props {
  setLineNumbers: (lineNumbers: Monaco['lineNumbers']) => void
  setMinimap: (minimap: Monaco['minimap']) => void
  setFontLigatures: (fontLigatures: Monaco['fontLigatures']) => void
  setWordWrap: (wordWrap: Monaco['wordWrap']) => void
  setWordWrapColumn: (wordWrapColumn: Monaco['wordWrapColumn']) => void
  setFontSize: (fontSize: Monaco['fontSize']) => void
  setLineHeight: (lineHeight: Monaco['lineHeight']) => void
  setStickyScroll: (stickyScroll: Monaco['stickyScroll']) => void
  setCursorBlinking: (cursorBlinking: Monaco['cursorBlinking']) => void
  setMouseStyle: (mouseStyle: Monaco['mouseStyle']) => void
  setCursorStyle: (cursorStyle: Monaco['cursorStyle']) => void
  setWrappingIndent: (wrappingIndent: Monaco['wrappingIndent']) => void
  setFolding: (folding: Monaco['folding']) => void
  setLetterSpacing: (letterSpacing: Monaco['letterSpacing']) => void
  setAutoClosingBrackets: (autoClosingBrackets: Monaco['autoClosingBrackets']) => void
  setAutoClosingQuotes: (autoClosingQuotes: Monaco['autoClosingQuotes']) => void
  setFormatOnPaste: (formatOnPaste: Monaco['formatOnPaste']) => void
  setFormatOnType: (formatOnType: Monaco['formatOnType']) => void
  setScrollBeyondLastLine: (scrollBeyondLastLine: Monaco['scrollBeyondLastLine']) => void
  setRenderLineHighlight: (renderLineHighlight: Monaco['renderLineHighlight']) => void
  setScrollbar: (scrollbar: Monaco['scrollbar']) => void
  setGlyphMargin: (glyphMargin: boolean) => void
  setRenderValidationDecorations: (renderValidationDecorations: Monaco['renderValidationDecorations']) => void
  setHideCursorInOverviewRuler: (hideCursorInOverviewRuler: Monaco['hideCursorInOverviewRuler']) => void
  setMatchBrackets: (matchBrackets: Monaco['matchBrackets']) => void
  resetPreferences: () => void
}

const state: StateCreator<Props & DefaultMonacoStore> = set => ({
  ...defaultMonacoStore,

  setLineNumbers: lineNumbers => set({ lineNumbers }),
  setMinimap: minimap => set({ minimap }),
  setFontLigatures: fontLigatures => set({ fontLigatures }),
  setWordWrap: wordWrap => set({ wordWrap }),
  setWordWrapColumn: wordWrapColumn => set({ wordWrapColumn }),
  setFontSize: fontSize => set({ fontSize }),
  setLineHeight: lineHeight => set({ lineHeight }),
  setStickyScroll: stickyScroll => set({ stickyScroll }),
  setCursorBlinking: cursorBlinking => set({ cursorBlinking }),
  setMouseStyle: mouseStyle => set({ mouseStyle }),
  setCursorStyle: cursorStyle => set({ cursorStyle }),
  setWrappingIndent: wrappingIndent => set({ wrappingIndent }),
  setFolding: folding => set({ folding }),
  setLetterSpacing: letterSpacing => set({ letterSpacing }),
  setAutoClosingBrackets: autoClosingBrackets => set({ autoClosingBrackets }),
  setAutoClosingQuotes: autoClosingQuotes => set({ autoClosingQuotes }),
  setFormatOnPaste: formatOnPaste => set({ formatOnPaste }),
  setFormatOnType: formatOnType => set({ formatOnType }),
  setScrollBeyondLastLine: scrollBeyondLastLine => set({ scrollBeyondLastLine }),
  setRenderLineHighlight: renderLineHighlight => set({ renderLineHighlight }),
  setScrollbar: scrollbar => set({ scrollbar }),
  setGlyphMargin: glyphMargin => set({ glyphMargin }),
  setRenderValidationDecorations: renderValidationDecorations => set({ renderValidationDecorations }),
  setHideCursorInOverviewRuler: hideCursorInOverviewRuler => set({ hideCursorInOverviewRuler }),
  setMatchBrackets: matchBrackets => set({ matchBrackets }),
  resetPreferences: () => set(defaultMonacoStore)
})

const useMonacoStore = create(state)

export default useMonacoStore
