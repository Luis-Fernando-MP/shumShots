import { CSSProperties } from 'react'
import { StateCreator, create } from 'zustand'

interface Props {
  background: string | null
  backgroundWidth: number
  backgroundHeight: number
  blendMode: string

  setBackground: (background: string) => void
  setBackgroundWidth: (backgroundWidth: number) => void
  setBackgroundHeight: (backgroundHeight: number) => void
  setBlendMode: (blendMode: string) => void

  getBackground: () => CSSProperties
}

const state: StateCreator<Props> = (set, get) => ({
  background: null,
  backgroundWidth: 900,
  backgroundHeight: 600,
  blendMode: 'normal',

  setBackgroundWidth: backgroundWidth => set({ backgroundWidth }),
  setBackgroundHeight: backgroundHeight => set({ backgroundHeight }),
  setBackground: background => {
    // TODO: Hacer que el fondo se aplique a todo el documento
    //  const body = document.body
    // if (body) {
    //   body.style.background = background
    // }
    set({ background })
  },
  setBlendMode: blendMode => set({ blendMode }),
  getBackground: () => {
    const { background, blendMode } = get()

    const newBackground = background ?? 'rgb(var(--tn-primary))'

    if (newBackground.includes('gradient')) {
      return {
        backgroundImage: newBackground,
        backgroundBlendMode: blendMode,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }
    }

    return { backgroundColor: newBackground }
  }
})

const useBackgroundStore = create(state)

export default useBackgroundStore
