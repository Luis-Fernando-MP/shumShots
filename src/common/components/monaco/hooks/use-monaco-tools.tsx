import { useMonacoStore } from '@/app/(pages)/(current)/store/config-monaco.store'
import { useRefMonacoStore } from '@/app/(pages)/(current)/store/refMonaco.store'

const useMonacoTools = () => {
  const { refIde } = useRefMonacoStore()
  const { setFontSize, fontSize } = useMonacoStore()

  const handleFontSize = (size: number): void => {
    setFontSize(size)
  }

  const handleFormatCode = () => {
    if (!refIde) return
    refIde.getAction('editor.action.formatDocument').run()
  }

  const handleUndo = () => {
    if (!refIde) return
    const model = refIde.getModel()
    if (!model) return
    model.undo()
  }

  const handleRedo = () => {
    if (!refIde) return
    const model = refIde.getModel()
    if (!model) return
    model.redo()
  }

  return {
    handleFontSize,
    handleFormatCode,
    handleUndo,
    handleRedo,
    fontSize
  }
}

export default useMonacoTools
