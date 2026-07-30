import type { LightLayer } from '@views/image-studio/Popups/common/presets/light'
import type { ShadowLayer } from '@views/image-studio/Popups/CanvasImages/ShadowLight/presets/shadow'
import type { TabLayer } from '@views/image-studio/Popups/common/components/tabs/store'

export interface ShadowTabConfig {
  shadowLayers: ShadowLayer[]
  lightLayers: LightLayer[]
  activeShadowId: string
  activeLightId: string
  linkFocus: boolean
}

interface ShadowState {
  byTab: Record<string, ShadowTabConfig>
  syncTabs: (layers: TabLayer[]) => void
  setActiveShadow: (tabId: string, id: string) => void
  setActiveLight: (tabId: string, id: string) => void
  setLinkFocus: (tabId: string, value: boolean) => void
  addShadowLayer: (tabId: string) => void
  addLightLayer: (tabId: string) => void
  removeShadowLayer: (tabId: string, id: string) => void
  removeLightLayer: (tabId: string, id: string) => void
  updateActiveShadow: (tabId: string, patch: Partial<Omit<ShadowLayer, 'id'>>) => void
  updateActiveLight: (tabId: string, patch: Partial<Omit<LightLayer, 'id'>>) => void
  applyShadowPreset: (tabId: string, type: ShadowLayer['type']) => void
  applyLightPreset: (tabId: string, type: LightLayer['type']) => void
  clearTab: (tabId: string) => void
  reset: () => void
  resolveForSlot: (slotId: string) => ShadowTabConfig
  getTabConfig: (tabId: string) => ShadowTabConfig
}

export default ShadowState
