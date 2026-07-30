import type { TabLayer } from '@views/image-studio/Popups/common/components/tabs/store'
import { layerAppliesTo } from '@views/image-studio/Popups/common/lib/fx-shared/targeting'

export const resolveTabConfig = <T,>(
  layers: TabLayer[],
  byTab: Record<string, T>,
  slotId: string,
  fallback: T
): T => {
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const layer = layers[i]
    if (!layerAppliesTo(layer.targetIds, slotId)) continue
    const config = byTab[layer.id]
    if (config) return config
  }
  return fallback
}

export const syncTabBuckets = <T,>(
  byTab: Record<string, T>,
  layers: TabLayer[],
  createDefault: () => T
): Record<string, T> => {
  const next: Record<string, T> = {}
  for (const layer of layers) {
    next[layer.id] = byTab[layer.id] ?? createDefault()
  }
  return next
}
