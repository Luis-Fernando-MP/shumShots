import { SHUM_DEV } from '@common/constants/pixis'
import { ThemeMonacoName, monacoThemes } from '@common/components/monaco/themes/monacoThemes'
import { DiffOnMount, Monaco, OnMount } from '@monaco-editor/react'
import { buildHighlightLineDecorations, buildKeywordDecorations } from '@views/code-studio/components/UserMonacoPreferences/utils'
import type { editor } from 'monaco-editor'
import { useCallback, useEffect, useRef, useState } from 'react'

import useMonacoThemeStore from '../store/monacoTheme.store'
import usePixisPreferencesStore from '../store/pixisPreferences.store'
import useReferenceMonacoStore from '../store/referenceMonaco'
import useWorkspaceStore from '../store/workspace.store'
import { exampleShotCode } from '../utils/exampleShotCode'

interface Props {
  typography: string
  fontSize: number
}

let keywordDecorationIds: string[] = []

const safeDeltaDecorations = (
  ed: editor.IStandaloneCodeEditor,
  ids: string[],
  next: editor.IModelDeltaDecoration[]
) => {
  try {
    if (!ed.getModel()) return []
    return ed.deltaDecorations(ids, next)
  } catch {
    return []
  }
}

const applyKeywordDecorations = (model: editor.ITextModel) => {
  if (model.isDisposed()) return
  try {
    keywordDecorationIds = model.deltaDecorations(
      keywordDecorationIds,
      buildKeywordDecorations(model)
    )
  } catch {
    keywordDecorationIds = []
  }
}

const useMonacoEditor = ({ typography, fontSize }: Props) => {
  const { $editor, setMonaco, setEditor } = useReferenceMonacoStore()
  const [moveBoard, setMoveBoard] = useState(false)
  const { themeName } = useMonacoThemeStore()
  const highlightLines = usePixisPreferencesStore(s => s.monaco.highlightLines)
  const keywordHighlight = usePixisPreferencesStore(s => s.monaco.keywordHighlight)
  const glyphMargin = usePixisPreferencesStore(s => s.monaco.glyphMargin)
  const highlightDecorationIds = useRef<string[]>([])
  const diffContentSub = useRef<{ dispose: () => void } | null>(null)
  const diffEditorInstance = useRef<editor.IStandaloneDiffEditor | null>(null)
  const diffActive = highlightLines?.diffView !== 'off'

  const detachDiffEditor = () => {
    const ed = diffEditorInstance.current
    diffEditorInstance.current = null
    diffContentSub.current?.dispose()
    diffContentSub.current = null
    if (!ed) return
    try {
      ed.setModel(null)
    } catch {}
  }

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) setMoveBoard(true)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Control') setMoveBoard(true)
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Control') setMoveBoard(false)
  }, [])

  const handleBeforeMount = useCallback(
    (monaco: Monaco) => {
      setMonaco(monaco)
      Object.keys(monacoThemes).forEach(name => {
        monaco.editor.defineTheme(name, monacoThemes[name as ThemeMonacoName] as any)
      })
    },
    [setMonaco]
  )

  const handleMount: OnMount = useCallback(
    (editorInstance, monaco) => {
      detachDiffEditor()
      setEditor(editorInstance)
      monaco.editor.setTheme(themeName)
    },
    [setEditor, themeName]
  )

  const handleDiffMount: DiffOnMount = useCallback(
    (diffEditor, monaco) => {
      detachDiffEditor()
      diffEditorInstance.current = diffEditor
      keywordDecorationIds = []

      const modified = diffEditor.getModifiedEditor()
      const original = diffEditor.getOriginalEditor()
      setEditor(modified)
      monaco.editor.setTheme(themeName)
      original.updateOptions({ readOnly: true })
      modified.updateOptions({ readOnly: false })

      diffContentSub.current = modified.onDidChangeModelContent(() => {
        const model = modified.getModel()
        if (!model || model.isDisposed()) return
        const activeId = useWorkspaceStore.getState().activeFileId
        if (!activeId) return
        useWorkspaceStore.getState().setFileContent(activeId, modified.getValue())
      })
    },
    [setEditor, themeName]
  )

  useEffect(() => {
    if (!$editor || diffActive) {
      keywordDecorationIds = []
      return
    }

    $editor.updateOptions({ glyphMargin: Boolean(glyphMargin) })
    const model = $editor.getModel()
    if (!model || model.isDisposed()) return

    applyKeywordDecorations(model)
    const sub = model.onDidChangeContent(() => applyKeywordDecorations(model))
    return () => sub.dispose()
  }, [$editor, keywordHighlight, glyphMargin, diffActive])

  useEffect(() => {
    if (!$editor) return
    const sub = $editor.onMouseDown(e => {
      if (!e.target.element?.classList.contains('user-monaco-highlight') || !window) return
      window.open(SHUM_DEV, '_blank')
    })
    return () => sub.dispose()
  }, [$editor])

  useEffect(() => {
    const domNode = $editor?.getDomNode()
    if (!$editor || !domNode) return
    domNode.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      domNode.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [$editor, handleWheel, handleKeyDown, handleKeyUp])

  useEffect(() => {
    if (!document.documentElement) return
    document.documentElement.style.setProperty('--monaco-font-family', typography)
    document.documentElement.style.setProperty('--monaco-font-size', `${fontSize}px`)
  }, [typography, fontSize])

  useEffect(() => {
    if (!$editor || !highlightLines || diffActive) {
      if ($editor) {
        highlightDecorationIds.current = safeDeltaDecorations($editor, highlightDecorationIds.current, [])
      }
      return
    }

    const model = $editor.getModel()
    if (!model || model.isDisposed()) return

    const apply = () => {
      highlightDecorationIds.current = safeDeltaDecorations(
        $editor,
        highlightDecorationIds.current,
        buildHighlightLineDecorations(highlightLines, model.getLineCount()) as editor.IModelDeltaDecoration[]
      )
    }

    apply()
    const sub = model.onDidChangeContent(apply)
    return () => {
      sub.dispose()
      highlightDecorationIds.current = safeDeltaDecorations($editor, highlightDecorationIds.current, [])
    }
  }, [$editor, highlightLines, diffActive])

  useEffect(() => () => detachDiffEditor(), [])

  return {
    moveBoard,
    exampleCode: exampleShotCode,
    handleMount,
    handleDiffMount,
    handleBeforeMount,
    themeName
  }
}

export default useMonacoEditor
