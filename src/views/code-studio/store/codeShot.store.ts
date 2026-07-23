import { StateCreator, create } from 'zustand'

interface ICodeShotStore {
  fileName: string
  setFileName: (fileName: string) => void
}

const state: StateCreator<ICodeShotStore> = set => ({
  fileName: 'PIXIS',
  setFileName: fileName => set({ fileName })
})

const useCodeShotStore = create(state)

export default useCodeShotStore
