import { StateCreator, create } from 'zustand'

export type ShadowType = 'none' | 'simple' | 'extended' | 'light'

type Positions = { x: number; y: number }

interface Props {
  position: Positions

  type: ShadowType
  opacity: number
  blur: number
  spread: number
  color: string

  setOpacity: (opacity: number) => void
  setBlur: (blur: number) => void
  setSpread: (spread: number) => void
  setColor: (color: string) => void
  setShadowType: (type: ShadowType) => void
  setPosition: (position: Positions) => void

  getShadowStyle: () => string
}

// -11px 5px 20px     8px      black   0.8
//  x     y  blur  spread   color  opacity
const state: StateCreator<Props> = (set, get) => ({
  opacity: 0,
  blur: 0,
  spread: 0,
  color: '0,0,0',
  type: 'none',
  position: { x: 0, y: 0 },

  setOpacity: opacity => set({ opacity }),
  setBlur: blur => set({ blur }),
  setSpread: spread => set({ spread }),
  setColor: color => set({ color }),
  setShadowType: type => set({ type }),
  setPosition: (position: Positions) => set({ position }),

  getShadowStyle: () => {
    const { opacity, blur, spread, type, position, color } = get()
    console.log('color', color)
    if (type === 'none') return 'none'

    const shadow1 = `${position.x / 2}px ${position.y / 2}px ${blur / 2}px ${spread / 2}px rgba(${color}, ${Math.min(opacity * 0.6, 0.5).toFixed(2)})`

    const shadow2 = `${position.x}px ${position.y}px ${blur}px ${spread}px rgba(${color}, ${opacity.toFixed(2)})`

    return `${shadow1}, ${shadow2}`
  }
})

const useShadowStore = create(state)

export default useShadowStore
