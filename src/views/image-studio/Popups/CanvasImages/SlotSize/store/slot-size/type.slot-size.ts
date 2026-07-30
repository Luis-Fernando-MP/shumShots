export type SizeLayer = {
  id: string
  targetIds: string[]
  width: number
  height: number
}

type SizeState = {
  layers: SizeLayer[]
  activeLayerId: string
  setActiveLayer: (id: string) => void
  addLayer: () => void
  removeLayer: (id: string) => void
  setLayerTargets: (ids: string[]) => void
  setLayerWidth: (width: number) => void
  setLayerHeight: (height: number) => void
  setLayerSize: (width: number, height: number) => void
  syncFromTabs: (layers: { id: string; targetIds: string[] }[], activeLayerId: string) => void
  purgeSlotTargets: (slotIds: string[]) => void
  reset: () => void
  resolveSlotSize: (slotId: string) => { width: number; height: number }
}

export default SizeState
