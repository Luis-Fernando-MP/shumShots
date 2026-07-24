'use client'

import '@common/monaco/setup'

import Editor from '@monaco-editor/react'
import {
  getLanguageMetaFromFileName,
  languageIdFromFileName,
  resolveMonacoFontFamily
} from '@common/monaco'
import useMonacoEditor from '@views/code-studio/hooks/useMonacoEditor'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useReferenceMonacoStore from '@views/code-studio/store/referenceMonaco'
import useWorkspaceStore, { selectActiveFile } from '@views/code-studio/store/workspace.store'
import { type FC, useEffect, useRef } from 'react'

import LoaderEditor from './LoaderEditor'

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

  const { moveBoard, exampleCode, handleMount, handleBeforeMount, themeName } = useMonacoEditor({
    typography,
    fontSize: monacoOpts.fontSize ?? 14
  })

  const skippingSync = useRef(false)
  const language = activeFile
    ? languageIdFromFileName(activeFile.name, fallbackLanguage.language)
    : fallbackLanguage.language

  useEffect(() => {
    if (!activeFile || activeFile.kind !== 'file') return
    const meta = getLanguageMetaFromFileName(activeFile.name)
    if (!meta) return
    if (meta.language === fallbackLanguage.language) return
    setLanguage(meta)
  }, [activeFile?.id, activeFile?.name, fallbackLanguage.language, setLanguage])

  useEffect(() => {
    if (!$editor || !activeFile || activeFile.kind !== 'file') return
    const next = activeFile.content ?? ''
    if ($editor.getValue() === next) return
    skippingSync.current = true
    $editor.setValue(next)
    skippingSync.current = false
  }, [$editor, activeFileId, activeFile])

  useEffect(() => {
    if (!$editor || !$monaco) return
    const model = $editor.getModel()
    if (!model) return
    $monaco.editor.setModelLanguage(model, language)
  }, [$editor, $monaco, language])

  return (
    <Editor
      loading={<LoaderEditor />}
      className={`editorComponent [&_.monaco-editor]:!outline-none [&_.monaco-editor_.overflow-guard_*]:!font-[family-name:var(--monaco-font-family)] [&_.monaco-editor_.overflow-guard_*]:!text-[length:var(--monaco-font-size)] [&_.relative-current-line-number]:!text-right [&_.user-monaco-highlight]:!cursor-pointer [&_.user-monaco-highlight]:border [&_.user-monaco-highlight]:border-primary [&_.user-monaco-highlight]:rounded-[3px] [&_.user-monaco-highlight]:bg-primary/20 [&_.user-monaco-highlight]:px-[3px] [&_.user-monaco-icon]:before:absolute [&_.user-monaco-icon]:before:top-1/2 [&_.user-monaco-icon]:before:left-full [&_.user-monaco-icon]:before:inline-block [&_.user-monaco-icon]:before:size-4 [&_.user-monaco-icon]:before:-translate-y-1/2 [&_.user-monaco-icon]:before:content-[''] [&_.user-monaco-icon]:before:bg-[url('/logo.webp')] [&_.user-monaco-icon]:before:bg-cover [&_.user-monaco-icon]:before:bg-center ${moveBoard ? 'zoom pointer-events-none' : ''}`}
      height='100%'
      options={{
        ...monacoOpts,
        theme: themeName,
        fontFamily: typography,
        contextmenu: false
      }}
      language={language}
      defaultLanguage={language}
      defaultValue={activeFile?.content ?? exampleCode}
      theme={themeName}
      onMount={handleMount}
      beforeMount={handleBeforeMount}
      onChange={value => {
        if (skippingSync.current || !activeFileId) return
        setFileContent(activeFileId, value ?? '')
      }}
    />
  )
}

export default EditorComponent
