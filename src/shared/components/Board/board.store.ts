import { StateCreator, create } from 'zustand'

export type Positions = { x: number; y: number }

interface IBoardStore {
  scale: number
  offset: Positions
  enableScroll: boolean
  nextChild: () => void
  prevChild: () => void
  moveToChild: (index: number) => void
  resetZoom: () => void

  setNextChild: (fn: IBoardStore['nextChild']) => void
  setPrevChild: (fn: IBoardStore['prevChild']) => void
  setMoveToChild: (fn: IBoardStore['moveToChild']) => void
  setResetZoom: (fn: IBoardStore['resetZoom']) => void

  setScale: (scale: number) => void
  setScaleCentered: (direction: 'in' | 'out', containerRect?: DOMRect, currentOffset?: Positions, currentScale?: number) => void
  setEnableScroll: (enableScroll: boolean) => void
  setOffset: (offset: Positions) => void
}

export const MIN_SCALE = 0.5
export const MAX_SCALE = 3
export const INITIAL_SCALE = 0.8

const state: StateCreator<IBoardStore> = (set, get) => ({
  scale: 1,
  offset: { x: 0, y: 0 },
  enableScroll: false,
  nextChild: () => {},
  prevChild: () => {},
  moveToChild: () => {},
  resetZoom: () => {},

  setEnableScroll: enableScroll => set({ enableScroll }),
  setScale: scale => {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))
    if (Math.abs(clampedScale - get().scale) < 0.001) return
    set({ scale: clampedScale })
  },
  setScaleCentered: (direction, containerRect, currentOffset, currentScale) => {
    if (!containerRect || !currentOffset || !currentScale) {
      const currentScale = get().scale
      const newScale = direction === 'in' ? currentScale + 0.3 : currentScale - 0.3
      const clampedScale = Math.max(0.5, Math.min(3.0, newScale))
      if (Math.abs(clampedScale - currentScale) < 0.0001) return
      set({ scale: clampedScale })
      return
    }

    const currentScaleValue = get().scale
    const newScale = direction === 'in' ? currentScaleValue + 0.3 : currentScaleValue - 0.3

    const clampedScale = Math.max(0.5, Math.min(3.0, newScale))

    if (Math.abs(clampedScale - currentScaleValue) < 0.0001) return

    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

    const currentCenterX = (centerX - currentOffset.x) / currentScale
    const currentCenterY = (centerY - currentOffset.y) / currentScale

    const newOffsetX = centerX - currentCenterX * clampedScale
    const newOffsetY = centerY - currentCenterY * clampedScale

    set({
      scale: clampedScale,
      offset: { x: newOffsetX, y: newOffsetY }
    })
  },
  setOffset: offset => set({ offset }),
  setNextChild: nextChild => set({ nextChild }),
  setPrevChild: prevChild => set({ prevChild }),
  setMoveToChild: moveToChild => set({ moveToChild }),
  setResetZoom: resetZoom => set({ resetZoom })
})

const useBoardStore = create(state)

export default useBoardStore
