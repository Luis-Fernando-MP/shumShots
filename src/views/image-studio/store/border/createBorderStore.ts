import type { BorderFinish } from '@views/image-studio/utils/borderFinish'
import { type StateCreator } from 'zustand'

export type BorderType = 'solid' | 'gradient' | 'none'
export type { BorderFinish }

export interface BorderConfigurationState {
  color: string
  size: number
  gradient: string | null
  type: BorderType
  finish: BorderFinish
  blendMode: string
  matEnabled: boolean
  matColor: string
  matTop: number
  matRight: number
  matBottom: number
  matLeft: number
  setColor: (color: string) => void
  setSize: (size: number) => void
  setGradient: (gradient: string) => void
  setType: (type: BorderType) => void
  setFinish: (finish: BorderFinish) => void
  setBlendMode: (blendMode: string) => void
  setMatEnabled: (matEnabled: boolean) => void
  setMatColor: (matColor: string) => void
  setMatSize: (size: number) => void
  setMatInsets: (insets: Partial<{ top: number; right: number; bottom: number; left: number }>) => void
  resetBorder: () => void
}

const DEFAULT_STATE = {
  color: 'rgba(255, 255, 255, 1)',
  size: 5,
  type: 'none' as BorderType,
  finish: 'soft' as BorderFinish,
  gradient: null as string | null,
  blendMode: 'normal',
  matEnabled: false,
  matColor: 'rgba(255, 255, 255, 1)',
  matTop: 0,
  matRight: 0,
  matBottom: 0,
  matLeft: 0
}

type CreateBorderStoreOptions = {
  size?: number
}

export const createBorderStore =
  (options: CreateBorderStoreOptions = {}): StateCreator<BorderConfigurationState> =>
  (set, get) => {
    const initial = {
      ...DEFAULT_STATE,
      size: options.size ?? DEFAULT_STATE.size
    }

    return {
      ...initial,
      setColor: color => set({ color }),
      setSize: size => set({ size }),
      setGradient: gradient => set({ gradient }),
      setType: type => set({ type }),
      setFinish: finish => set({ finish }),
      setBlendMode: blendMode => set({ blendMode }),
      setMatColor: matColor => set({ matColor }),
      setMatEnabled: matEnabled => {
        if (!matEnabled) {
          set({ matEnabled: false })
          return
        }
        const { matTop, matRight, matBottom, matLeft } = get()
        const hasInset = matTop + matRight + matBottom + matLeft > 0
        if (hasInset) {
          set({ matEnabled: true })
          return
        }
        set({
          matEnabled: true,
          matTop: 16,
          matRight: 16,
          matBottom: 16,
          matLeft: 16
        })
      },
      setMatSize: size => {
        const { matTop, matBottom } = get()
        const ratio = matTop > 0 ? matBottom / matTop : 1
        const bottom = ratio > 1.1 ? Math.round(size * ratio) : size
        set({
          matTop: size,
          matRight: size,
          matLeft: size,
          matBottom: bottom,
          matEnabled: size > 0
        })
      },
      setMatInsets: insets =>
        set(state => {
          const matTop = insets.top ?? state.matTop
          const matRight = insets.right ?? state.matRight
          const matBottom = insets.bottom ?? state.matBottom
          const matLeft = insets.left ?? state.matLeft
          const hasInset = matTop + matRight + matBottom + matLeft > 0
          return {
            matTop,
            matRight,
            matBottom,
            matLeft,
            matEnabled: hasInset ? true : state.matEnabled
          }
        }),
      resetBorder: () => set(initial)
    }
  }
