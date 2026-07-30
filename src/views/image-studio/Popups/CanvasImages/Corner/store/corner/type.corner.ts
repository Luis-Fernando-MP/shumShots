import type { BorderType } from '@views/image-studio/Popups/common/components/createBorderStore'
import type { TabLayer } from '@views/image-studio/Popups/common/components/tabs/store'
import type { BorderFinish } from '@views/image-studio/utils/borderFinish'

export type CornerBorderConfig = {
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
}

export type CornerRadiusConfig = {
  activeIndividualBorder: boolean
  borderLTRadius: number
  borderRTRadius: number
  borderLBRadius: number
  borderRBRadius: number
  borderRadius: number
  borderSmooth: number
}

export type CornerTabConfig = {
  border: CornerBorderConfig
  radius: CornerRadiusConfig
}

type CornerState = {
  byTab: Record<string, CornerTabConfig>
  syncTabs: (layers: TabLayer[]) => void
  patchBorder: (tabId: string, patch: Partial<CornerBorderConfig>) => void
  patchRadius: (tabId: string, patch: Partial<CornerRadiusConfig>) => void
  reset: () => void
  resolveForSlot: (slotId: string) => CornerTabConfig
}

export default CornerState
