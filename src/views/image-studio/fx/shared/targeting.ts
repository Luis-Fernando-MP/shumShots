export const SHADOW_DESIGN_REF = 280

export const shadowScaleForSize = (edgePx: number) => {
  if (!Number.isFinite(edgePx) || edgePx <= 0) return 1
  return Math.min(3.4, Math.max(0.28, edgePx / SHADOW_DESIGN_REF))
}

export const layerAppliesTo = (targetIds: string[], slotId: string) =>
  targetIds.length === 0 || targetIds.includes(slotId)
