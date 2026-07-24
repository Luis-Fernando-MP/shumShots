import Editor from '@monaco-editor/react'
import { type FC } from 'react'

import useMonacoEditor from '../../hooks/useMonacoEditor'
import usePixisPreferencesStore from '../../store/pixisPreferences.store'
import LoaderEditor from './LoaderEditor'

const EditorComponent: FC = () => {
  const monaco = usePixisPreferencesStore(s => s.monaco)
  const language = usePixisPreferencesStore(s => s.pixis.language)
  const typography = usePixisPreferencesStore(s => s.pixis.typography)

  const { moveBoard, exampleCode, handleMount, handleBeforeMount, themeName } = useMonacoEditor({
    typography,
    fontSize: monaco.fontSize ?? 14
  })

  return (
    <Editor
      loading={<LoaderEditor />}
      className={`editorComponent [&_.monaco-editor]:!outline-none [&_.monaco-editor_.overflow-guard_*]:!font-[family-name:var(--monaco-font-family)] [&_.monaco-editor_.overflow-guard_*]:!text-[length:var(--monaco-font-size)] [&_.relative-current-line-number]:!text-right [&_.user-monaco-highlight]:!cursor-pointer [&_.user-monaco-highlight]:border [&_.user-monaco-highlight]:border-primary [&_.user-monaco-highlight]:rounded-[3px] [&_.user-monaco-highlight]:bg-primary/20 [&_.user-monaco-highlight]:px-[3px] [&_.user-monaco-icon]:before:absolute [&_.user-monaco-icon]:before:top-1/2 [&_.user-monaco-icon]:before:left-full [&_.user-monaco-icon]:before:inline-block [&_.user-monaco-icon]:before:size-4 [&_.user-monaco-icon]:before:-translate-y-1/2 [&_.user-monaco-icon]:before:content-[''] [&_.user-monaco-icon]:before:bg-[url('/logo.webp')] [&_.user-monaco-icon]:before:bg-cover [&_.user-monaco-icon]:before:bg-center ${moveBoard ? 'zoom pointer-events-none' : ''}`}
      height='100%'
      options={{
        ...monaco,
        theme: themeName,
        fontFamily: typography,
        contextmenu: false
      }}
      language={language.language}
      defaultLanguage='typescript'
      defaultValue={exampleCode}
      theme={themeName}
      onMount={handleMount}
      beforeMount={handleBeforeMount}
    />
  )
}

export default EditorComponent
