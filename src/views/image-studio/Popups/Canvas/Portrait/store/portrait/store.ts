import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PortraitMode = 'none' | 'lensBlur' | 'stage' | 'magnifier' | 'linearBlur'

export type PortraitState = {
  mode: PortraitMode
  focusX: number
  focusY: number
  size: number
  amount: number
  softness: number
  zoom: number
  noise: number
  canvasBlur: number
}

type PortraitStore = PortraitState & {
  setMode: (mode: PortraitMode) => void
  setFocus: (x: number, y: number) => void
  setSize: (size: number) => void
  setAmount: (amount: number) => void
  setSoftness: (softness: number) => void
  setZoom: (zoom: number) => void
  setNoise: (noise: number) => void
  setCanvasBlur: (canvasBlur: number) => void
  reset: () => void
}

const initial = (): PortraitState => ({
  mode: 'none',
  focusX: 50,
  focusY: 50,
  size: 38,
  amount: 55,
  softness: 40,
  zoom: 2,
  noise: 0,
  canvasBlur: 0
})

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const usePortraitStore = create<PortraitStore>()(
  persist(
    set => ({
      ...initial(),
      setMode: mode => set({ mode }),
      setFocus: (x, y) => set({ focusX: clamp(x, 0, 100), focusY: clamp(y, 0, 100) }),
      setSize: size => set({ size: clamp(size, 8, 80) }),
      setAmount: amount => set({ amount: clamp(amount, 0, 100) }),
      setSoftness: softness => set({ softness: clamp(softness, 5, 90) }),
      setZoom: zoom => set({ zoom: clamp(zoom, 1.2, 4) }),
      setNoise: noise => set({ noise: clamp(noise, 0, 100) }),
      setCanvasBlur: canvasBlur => set({ canvasBlur: clamp(canvasBlur, 0, 24) }),
      reset: () => set(initial())
    }),
    { name: 'image-studio-portrait' }
  )
)

export default usePortraitStore
