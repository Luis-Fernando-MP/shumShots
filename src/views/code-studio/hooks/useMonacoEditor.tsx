import { SHUM_DEV } from '@/shared/constants'
import { ThemeMonacoName, monacoThemes } from '@/shared/themes/monacoThemes'
import { DiffOnMount, Monaco, OnMount } from '@monaco-editor/react'
import { buildHighlightLineDecorations } from '@views/code-studio/components/UserMonacoPreferences/utils'
import type { editor } from 'monaco-editor'
import { useCallback, useEffect, useRef, useState } from 'react'

import useMonacoThemeStore from '../store/monacoTheme.store'
import usePixisPreferencesStore from '../store/pixisPreferences.store'
import useReferenceMonacoStore from '../store/referenceMonaco'
import useWorkspaceStore from '../store/workspace.store'
import { exampleShotCode } from '../utils/exampleShotCode'

const hoverMessage = `Te invito a visitar mi sitio web 👋: [luis-mp](${SHUM_DEV})`
const acceptedList = [
  'shum-shot',
  'Shum Shot',
  'Shots',
  'shot',
  'luigfmp@gmail',
  'luis-mp',
  'LUIS',
  'SHOTS',
  'SHOT',
  'SHUM',
  'SHUM-SHOT',
  'SHUM-SHOTS'
]

interface Props {
  typography: string
  fontSize: number
}

let previousDecorations: string[] = []

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

const useMonacoEditor = ({ typography, fontSize }: Props) => {
  const { $editor, setMonaco, setEditor } = useReferenceMonacoStore()
  const [moveBoard, setMoveBoard] = useState(false)
  const { themeName } = useMonacoThemeStore()
  const highlightLines = usePixisPreferencesStore(s => s.monaco.highlightLines)
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

  const loadAllThemes = useCallback((monaco: Monaco) => {
    Object.keys(monacoThemes).forEach(name => {
      monaco.editor.defineTheme(name, monacoThemes[name as ThemeMonacoName] as any)
    })
  }, [])

  const handleBeforeMount = useCallback(
    (monaco: Monaco) => {
      setMonaco(monaco)
      loadAllThemes(monaco)
    },
    [setMonaco, loadAllThemes]
  )

  const closureUpdateDecorations = (editorModel: editor.ITextModel) => {
    if (editorModel.isDisposed()) return
    try {
      const newDecorations: editor.IModelDeltaDecoration[] = []
      acceptedList.forEach(item => {
        const matches = editorModel.findMatches(item, false, false, true, null, false)
        matches.forEach(match => {
          newDecorations.push({
            range: match.range,
            options: {
              stickiness: 1,
              isWholeLine: false,
              inlineClassName: 'user-monaco-highlight',
              glyphMarginClassName: 'user-monaco-icon',
              shouldFillLineOnLineBreak: false,
              blockDoesNotCollapse: true,
              showIfCollapsed: true,
              hoverMessage: {
                value: hoverMessage,
                isTrusted: true
              }
            }
          })
        })
      })
      previousDecorations = editorModel.deltaDecorations(previousDecorations, newDecorations)
    } catch {
      previousDecorations = []
    }
  }

  const updateBrandDecorations = useCallback((model: editor.ITextModel | null) => {
    if (!model || model.isDisposed()) return
    closureUpdateDecorations(model)
    model.onDidChangeContent(() => {
      if (model.isDisposed()) return
      closureUpdateDecorations(model)
    })
  }, [])

  const handleMount: OnMount = useCallback(
    (editorInstance, monaco) => {
      detachDiffEditor()
      setEditor(editorInstance)
      monaco.editor.setTheme(themeName)
      updateBrandDecorations(editorInstance.getModel())
    },
    [setEditor, themeName, updateBrandDecorations]
  )

  const handleDiffMount: DiffOnMount = useCallback(
    (diffEditor, monaco) => {
      detachDiffEditor()
      diffEditorInstance.current = diffEditor

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
