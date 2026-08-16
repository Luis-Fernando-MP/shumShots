'use client'

import { getLanguageMetaFromFileName, languageIdFromFileName, resolveMonacoFontFamily } from '@common/components/monaco'
import '@common/components/monaco/setup'
import { DiffEditor, Editor, type MonacoDiffEditor } from '@monaco-editor/react'
import useMonacoEditor from '@views/code-studio/hooks/useMonacoEditor'
import useDiffHistoryStore from '@views/code-studio/store/diffHistory.store'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useReferenceMonacoStore from '@views/code-studio/store/referenceMonaco'
import useWorkspaceStore, { selectActiveFile } from '@views/code-studio/store/workspace.store'
import type { FsEntry } from '@views/code-studio/utils/workspace.types'
import { ensureKeywordGlyphStyles } from '@views/code-studio/components/UserMonacoPreferences/utils'
import { type FC, useEffect, useMemo, useRef } from 'react'

import LoaderEditor from './LoaderEditor'
import './monaco.css'

const HIGHLIGHT_LINE_CLASSES = [
  '[&_.pixis-line-highlight.pixis-hl-amber]:bg-[rgba(229,192,123,0.16)]',
  '[&_.pixis-line-highlight.pixis-hl-blue]:bg-[rgba(97,175,239,0.16)]',
  '[&_.pixis-line-highlight.pixis-hl-green]:bg-[rgba(152,195,121,0.16)]',
  '[&_.pixis-line-highlight.pixis-hl-pink]:bg-[rgba(198,120,221,0.16)]',
  '[&_.pixis-line-highlight.pixis-hl-purple]:bg-[rgba(167,139,250,0.16)]'
].join(' ')

const EDITOR_CHROME_CLASSES =
  'editorComponent [&_.monaco-editor]:!outline-none [&_.monaco-editor_.overflow-guard_*]:!font-[family-name:var(--monaco-font-family)] [&_.monaco-editor_.overflow-guard_*]:!text-[length:var(--monaco-font-size)] [&_.relative-current-line-number]:!text-right'

const applyDiffLayout = (ed: MonacoDiffEditor, sideBySide: boolean) => {
  try {
    ed.updateOptions({
      renderSideBySide: sideBySide,
      renderSideBySideInlineBreakpoint: 0
    })
  } catch {}
}

const detachDiffModels = (ed: MonacoDiffEditor | null) => {
  if (!ed) return
  try {
    ed.setModel(null)
  } catch {}
}

const fileContent = (file: FsEntry | undefined, fallback: string) => {
  if (file?.kind === 'file') return file.content ?? ''
  return fallback
}

const EditorComponent: FC = () => {
  const monacoOpts = usePixisPreferencesStore(s => s.monaco)
  const fallbackLanguage = usePixisPreferencesStore(s => s.pixis.language)
  const setLanguage = usePixisPreferencesStore(s => s.setLanguage)
  const typographyId = usePixisPreferencesStore(s => s.pixis.typography)
  const typography = resolveMonacoFontFamily(typographyId)

  const activeFile = useWorkspaceStore(selectActiveFile)
  const activeFileId = useWorkspaceStore(s => s.activeFileId)
  const setFileContent = useWorkspaceStore(s => s.setFileContent)

  const $editor = useReferenceMonacoStore(s => s.$editor)
  const $monaco = useReferenceMonacoStore(s => s.$monaco)
  const setEditor = useReferenceMonacoStore(s => s.setEditor)

  const ensureOriginal = useDiffHistoryStore(s => s.ensureOriginal)
  const diffEntry = useDiffHistoryStore(s => (activeFileId ? s.byFileId[activeFileId] : undefined))

  const diffView = monacoOpts.highlightLines?.diffView ?? 'off'
  const diffActive = diffView !== 'off'
  const sideBySide = diffView === 'sideBySide'
  const showWhitespace = monacoOpts.highlightLines?.showWhitespace ?? true

  const { moveBoard, exampleCode, handleMount, handleDiffMount, handleBeforeMount, themeName } =
    useMonacoEditor({
      typography,
      fontSize: monacoOpts.fontSize ?? 14
    })

  const skippingSync = useRef(false)
  const diffEditorRef = useRef<MonacoDiffEditor | null>(null)
  const sideBySideRef = useRef(sideBySide)
  sideBySideRef.current = sideBySide

  useEffect(() => {
    ensureKeywordGlyphStyles()
  }, [])

  const language = activeFile
    ? languageIdFromFileName(activeFile.name, fallbackLanguage.language)
    : fallbackLanguage.language

  const modifiedContent = fileContent(activeFile, exampleCode)
  const diffRevision = diffEntry?.revision ?? 1
  const resolvedOriginal = diffEntry?.original ?? (diffActive ? modifiedContent : undefined)
  const canShowDiff = Boolean(diffActive && activeFileId && resolvedOriginal != null)

  useEffect(() => {
    if (!diffActive || !activeFileId) {
      detachDiffModels(diffEditorRef.current)
      diffEditorRef.current = null
      setEditor(null)
      return
    }

    const entry = useWorkspaceStore.getState().entries[activeFileId]
    ensureOriginal(activeFileId, fileContent(entry, exampleCode))
  }, [diffActive, activeFileId, exampleCode, ensureOriginal, setEditor])

  useEffect(() => {
    const ed = diffEditorRef.current
    if (!ed || !diffActive) return
    applyDiffLayout(ed, sideBySide)
  }, [sideBySide, diffActive])

  useEffect(() => {
    if (!activeFile || activeFile.kind !== 'file') return
    const meta = getLanguageMetaFromFileName(activeFile.name)
    if (!meta || meta.language === fallbackLanguage.language) return
    setLanguage(meta)
  }, [activeFile, activeFile?.id, activeFile?.name, fallbackLanguage.language, setLanguage])

  useEffect(() => {
    if (diffActive || !$editor || !activeFile || activeFile.kind !== 'file') return
    const next = activeFile.content ?? ''
    if ($editor.getValue() === next) return
    skippingSync.current = true
    $editor.setValue(next)
    skippingSync.current = false
  }, [$editor, activeFileId, activeFile, diffActive])

  useEffect(() => {
    if (diffActive || !$editor || !$monaco) return
    const model = $editor.getModel()
    if (!model) return
    $monaco.editor.setModelLanguage(model, language)
  }, [$editor, $monaco, language, diffActive])

  useEffect(
    () => () => {
      detachDiffModels(diffEditorRef.current)
      diffEditorRef.current = null
    },
    []
  )

  const sharedClassName = [
    EDITOR_CHROME_CLASSES,
    HIGHLIGHT_LINE_CLASSES,
    'h-full w-full',
    moveBoard && 'zoom pointer-events-none'
  ]
    .filter(Boolean)
    .join(' ')

  const diffOptions = useMemo(
    () => ({
      fontSize: monacoOpts.fontSize,
      lineHeight: monacoOpts.lineHeight,
      fontLigatures: monacoOpts.fontLigatures,
      letterSpacing: monacoOpts.letterSpacing,
      fontFamily: typography,
      lineNumbers: monacoOpts.lineNumbers,
      renderValidationDecorations: monacoOpts.renderValidationDecorations ?? 'off',
      renderWhitespace: showWhitespace ? ('all' as const) : ('none' as const),
      renderLineHighlight: 'none' as const,
      scrollBeyondLastLine: false,
      folding: false,
      glyphMargin: false,
      stickyScroll: { enabled: false },
      minimap: { enabled: false },
      scrollbar: {
        vertical: 'auto' as const,
        horizontal: 'auto' as const,
        useShadows: false
      },
      renderSideBySide: true,
      renderSideBySideInlineBreakpoint: 0,
      renderIndicators: true,
      renderMarginRevertIcon: false,
      renderGutterMenu: false,
      experimental: { showEmptyDecorations: false },
      ignoreTrimWhitespace: !showWhitespace,
      enableSplitViewResizing: true,
      originalEditable: false,
      readOnly: false,
      contextmenu: false,
      automaticLayout: true,
      wordWrap: 'off' as const
    }),
    [
      monacoOpts.fontSize,
      monacoOpts.lineHeight,
      monacoOpts.fontLigatures,
      monacoOpts.letterSpacing,
      monacoOpts.lineNumbers,
      monacoOpts.renderValidationDecorations,
      showWhitespace,
      typography
    ]
  )

  const editorOptions = useMemo(() => {
    const base = Object.fromEntries(
      Object.entries(monacoOpts).filter(
        ([key]) => key !== 'highlightLines' && key !== 'keywordHighlight'
      )
    )
    return {
      ...base,
      theme: themeName,
      fontFamily: typography,
      contextmenu: false,
      automaticLayout: true,
      lineDecorationsWidth: 0
    }
  }, [monacoOpts, themeName, typography])

  return (
    <div className='h-full min-h-0 w-full min-w-0'>
      {diffActive && !canShowDiff && (
        <div className='flex h-full min-h-0 w-full items-center justify-center'>
          <LoaderEditor />
        </div>
      )}

      {canShowDiff && activeFileId && resolvedOriginal != null && (
        <DiffEditor
          key={`diff-${activeFileId}-r${diffRevision}`}
          loading={<LoaderEditor />}
          className={sharedClassName}
          height='100%'
          width='100%'
          language={language}
          originalLanguage={language}
          modifiedLanguage={language}
          original={resolvedOriginal}
          modified={modifiedContent}
          originalModelPath={`inmemory://pixis/diff/${activeFileId}/r${diffRevision}/original`}
          modifiedModelPath={`inmemory://pixis/diff/${activeFileId}/r${diffRevision}/modified`}
          keepCurrentOriginalModel
          keepCurrentModifiedModel
          theme={themeName}
          options={diffOptions}
          beforeMount={handleBeforeMount}
          onMount={(editor, monaco) => {
            diffEditorRef.current = editor
            handleDiffMount(editor, monaco)
            applyDiffLayout(editor, sideBySideRef.current)
          }}
        />
      )}

      {!diffActive && (
        <Editor
          loading={<LoaderEditor />}
          className={sharedClassName}
          height='100%'
          width='100%'
          path={`inmemory://pixis/file/${activeFileId ?? 'scratch'}`}
          options={editorOptions}
          language={language}
          defaultLanguage={language}
          defaultValue={fileContent(activeFile, exampleCode)}
          theme={themeName}
          onMount={handleMount}
          beforeMount={handleBeforeMount}
          onChange={value => {
            if (skippingSync.current || !activeFileId) return
            setFileContent(activeFileId, value ?? '')
          }}
        />
      )}
    </div>
  )
}

export default EditorComponent
