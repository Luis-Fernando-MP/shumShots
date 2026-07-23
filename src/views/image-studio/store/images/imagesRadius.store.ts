import { StateCreator, create } from 'zustand'

export interface Props {
  activeIndividualBorder: boolean
  borderLTRadius: number
  borderRTRadius: number
  borderLBRadius: number
  borderRBRadius: number
  borderRadius: number

  setActiveIndividualBorder: (activeIndividualBorder: boolean) => void
  setBorderRadius: (borderRadius: number) => void
  setBorderLTRadius: (borderLTRadius: number) => void
  setBorderRTRadius: (borderRTRadius: number) => void
  setBorderLBRadius: (borderLBRadius: number) => void
  setBorderRBRadius: (borderRBRadius: number) => void

  getStyleBorderRadius: () => { [key: string]: string }
}

const state: StateCreator<Props> = (set, get) => ({
  activeIndividualBorder: false,
  borderLTRadius: 20,
  borderRTRadius: 20,
  borderLBRadius: 20,
  borderRBRadius: 20,
  borderRadius: 20,

  setActiveIndividualBorder: activeIndividualBorder => set({ activeIndividualBorder }),
  setBorderRadius: borderRadius => set({ borderRadius }),
  setBorderLTRadius: borderLTRadius => set({ borderLTRadius }),
  setBorderRTRadius: borderRTRadius => set({ borderRTRadius }),
  setBorderLBRadius: borderLBRadius => set({ borderLBRadius }),
  setBorderRBRadius: borderRBRadius => set({ borderRBRadius }),
  getStyleBorderRadius: () => {
    const activeIndividualBorder = get().activeIndividualBorder
    if (!activeIndividualBorder) return { borderRadius: `${get().borderRadius}px` }
    return {
      borderRadius: `${get().borderLTRadius}px ${get().borderRTRadius}px ${get().borderLBRadius}px ${get().borderRBRadius}px`
    }
  }
})

const useImagesRadiusStore = create(state)

export default useImagesRadiusStore
