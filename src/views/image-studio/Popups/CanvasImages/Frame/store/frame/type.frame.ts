import type { TabLayer } from '@views/image-studio/Popups/common/components/tabs/store'

export type FrameFitMode = 'cover' | 'contain' | 'fill'
export type SlotPan = { x: number; y: number }

export type FrameTabConfig = {
  frameId: string | null
  fitMode: FrameFitMode
}

type FrameState = {
  byTab: Record<string, FrameTabConfig>
  slotPan: Record<string, SlotPan>
  syncTabs: (layers: TabLayer[]) => void
  setFrameId: (tabId: string, frameId: string | null) => void
  setFitMode: (tabId: string, fitMode: FrameFitMode) => void
  setPanForSlots: (slotIds: string[], pan: SlotPan) => void
  getPanForSlot: (slotId: string) => SlotPan
  resolveForSlot: (slotId: string) => FrameTabConfig
  syncResolvedFramesToPictures: () => void
  reset: () => void
}

export default FrameState
