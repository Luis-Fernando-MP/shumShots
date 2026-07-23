import { CSSProperties } from 'react'
import { StateCreator, create } from 'zustand'

export type BorderType = 'solid' | 'gradient' | 'none'
export type BoxSizing = 'border-box' | 'content-box'

export interface BorderConfigurationState {
  color: string
  size: number
  gradient: string | null
  type: BorderType
  boxSizing: BoxSizing
  blendMode: string

  setColor: (color: string) => void
  setSize: (size: number) => void
  setGradient: (gradient: string) => void
  setType: (type: BorderType) => void

  getBorderStyle: () => CSSProperties | null
  setBoxSizing: (boxSizing: BoxSizing) => void
  setBlendMode: (blendMode: string) => void
}

const state: StateCreator<BorderConfigurationState> = (set, get) => ({
  color: 'rgb(var(--tn-primary))',
  size: 5,
  type: 'none',
  gradient: null,
  boxSizing: 'border-box',
  blendMode: 'normal',

  setColor: color => set({ color }),
  setSize: size => set({ size }),
  setGradient: gradient => set({ gradient }),
  setType: type => set({ type }),
  setBoxSizing: boxSizing => set({ boxSizing }),
  setBlendMode: blendMode => set({ blendMode }),

  getBorderStyle: () => {
    const { color, size, type, boxSizing, gradient, blendMode } = get()

    const newBorder: CSSProperties = {
      border: `${size}px solid ${color}`,
      background: 'none',
      boxSizing,
      backgroundBlendMode: 'normal'
    }

    if (type === 'solid') return newBorder

    if (type === 'none' || !gradient)
      return { border: 'none', background: 'none', boxSizing: 'border-box', backgroundBlendMode: 'normal' }

    return {
      background: gradient,
      border: `${size}px solid transparent`,
      boxSizing,
      backgroundClip: 'border-box',
      backgroundBlendMode: blendMode
    }
  }
})

const UseImagesBorderStore = create(state)

export default UseImagesBorderStore
