import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Positions = { x: number; y: number }
export type ZoomDirection = 'in' | 'out'

export const GRID_SIZES = [10, 20, 30, 40, 50] as const
export type GridSize = (typeof GRID_SIZES)[number]
export const DEFAULT_GRID_SIZE = 20

export const isGridSize = (value: unknown): value is GridSize =>
  typeof value === 'number' && (GRID_SIZES as readonly number[]).includes(value)

interface IBoardStore {
  scale: number
  offset: Positions
  enableScroll: boolean
  showGrid: boolean
  snapToGrid: boolean
  gridSize: GridSize
  nextChild: () => void
  prevChild: () => void
  moveToChild: (index: number) => void
  resetZoom: () => void
  zoomCentered: (direction: ZoomDirection) => void

  setNextChild: (fn: IBoardStore['nextChild']) => void
  setPrevChild: (fn: IBoardStore['prevChild']) => void
  setMoveToChild: (fn: IBoardStore['moveToChild']) => void
  setResetZoom: (fn: IBoardStore['resetZoom']) => void
  setZoomCentered: (fn: IBoardStore['zoomCentered']) => void

  setScale: (scale: number) => void
  setScaleCentered: (direction: ZoomDirection, containerRect: DOMRect) => void
  setScaleAndOffset: (scale: number, offset: Positions) => void
  setEnableScroll: (enableScroll: boolean) => void
  setOffset: (offset: Positions) => void
  setShowGrid: (showGrid: boolean) => void
  setSnapToGrid: (snapToGrid: boolean) => void
  setGridSize: (gridSize: GridSize) => void
}

export const MIN_SCALE = 0.1
export const MAX_SCALE = 4
export const INITIAL_SCALE = 0.8
export const ZOOM_STEP = 0.3
export const SCALE_EPSILON = 0.001
export const WHEEL_ZOOM_INTENSITY = 0.0018

export const snapToDevicePixel = (value: number): number => {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return Math.round(value * dpr) / dpr
}

export const snapOffset = (offset: Positions, gridSize?: number): Positions => {
  const device = {
    x: snapToDevicePixel(offset.x),
    y: snapToDevicePixel(offset.y)
  }
  if (gridSize == null) return device
  return {
    x: snapToDevicePixel(Math.round(device.x / gridSize) * gridSize),
    y: snapToDevicePixel(Math.round(device.y / gridSize) * gridSize)
  }
}

const clampScale = (scale: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))

const atMaxScale = (scale: number) => scale >= MAX_SCALE - SCALE_EPSILON
const atMinScale = (scale: number) => scale <= MIN_SCALE + SCALE_EPSILON

const state: StateCreator<IBoardStore> = (set, get) => ({
  scale: 1,
  offset: { x: 0, y: 0 },
  enableScroll: false,
  showGrid: true,
  snapToGrid: false,
  gridSize: DEFAULT_GRID_SIZE,
  nextChild: () => {},
  prevChild: () => {},
  moveToChild: () => {},
  resetZoom: () => {},
  zoomCentered: () => {},

  setEnableScroll: enableScroll => set({ enableScroll }),
  setScale: scale => {
    const clampedScale = clampScale(scale)
    if (Math.abs(clampedScale - get().scale) < SCALE_EPSILON) return
    set({ scale: clampedScale })
  },
  setScaleCentered: (direction, containerRect) => {
    const { scale: currentScale, offset: currentOffset } = get()

    if (direction === 'in' && atMaxScale(currentScale)) return
    if (direction === 'out' && atMinScale(currentScale)) return

    const nextScale =
      direction === 'in' ? Math.min(MAX_SCALE, currentScale + ZOOM_STEP) : Math.max(MIN_SCALE, currentScale - ZOOM_STEP)

    if (Math.abs(nextScale - currentScale) < SCALE_EPSILON) return

    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2
    const contentX = (centerX - currentOffset.x) / currentScale
    const contentY = (centerY - currentOffset.y) / currentScale

    set({
      scale: nextScale,
      offset: snapOffset({
        x: centerX - contentX * nextScale,
        y: centerY - contentY * nextScale
      })
    })
  },
  setOffset: offset => set({ offset: snapOffset(offset) }),
  setShowGrid: showGrid => set({ showGrid }),
  setSnapToGrid: snapToGrid => set({ snapToGrid }),
  setGridSize: gridSize => {
    if (!isGridSize(gridSize)) return
    set({ gridSize })
  },
  setScaleAndOffset: (scale, offset) => {
    const clampedScale = clampScale(scale)
    const { scale: prevScale, offset: prevOffset } = get()
    const sameScale = Math.abs(clampedScale - prevScale) < SCALE_EPSILON
    const sameOffset = Math.abs(offset.x - prevOffset.x) < SCALE_EPSILON && Math.abs(offset.y - prevOffset.y) < SCALE_EPSILON
    if (sameScale && sameOffset) return
    set({ scale: clampedScale, offset })
  },
  setNextChild: nextChild => set({ nextChild }),
  setPrevChild: prevChild => set({ prevChild }),
  setMoveToChild: moveToChild => set({ moveToChild }),
  setResetZoom: resetZoom => set({ resetZoom }),
  setZoomCentered: zoomCentered => set({ zoomCentered })
})

const useBoardStore = create(
  persist(state, {
    name: 'pixis-board-grid',
    partialize: s => ({
      showGrid: s.showGrid,
      snapToGrid: s.snapToGrid,
      gridSize: s.gridSize
    }),
    merge: (persisted, current) => {
      const data = persisted as Partial<Pick<IBoardStore, 'showGrid' | 'snapToGrid' | 'gridSize'>> | undefined
      return {
        ...current,
        showGrid: data?.showGrid ?? current.showGrid,
        snapToGrid: data?.snapToGrid ?? current.snapToGrid,
        gridSize: isGridSize(data?.gridSize) ? data.gridSize : current.gridSize
      }
    }
  })
)

export default useBoardStore
