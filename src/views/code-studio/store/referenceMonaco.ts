import { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { StateCreator, create } from 'zustand'

interface IReferenceMonacoStore {
  $monaco: Monaco | null
  $editor: editor.IStandaloneCodeEditor | null

  setMonaco: (monaco: Monaco) => void
  setEditor: (editor: editor.IStandaloneCodeEditor | null) => void
}

const state: StateCreator<IReferenceMonacoStore> = set => ({
  $monaco: null,
  $editor: null,

  setMonaco: monaco => set({ $monaco: monaco }),
  setEditor: editor => set({ $editor: editor })
})

const useReferenceMonacoStore = create(state)

export default useReferenceMonacoStore
