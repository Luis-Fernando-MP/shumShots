'use client'

import useShadowStore, {
  getActiveLight,
  getActiveShadow,
  type LightLayer,
  type ShadowLayer
} from '@views/image-studio/store/shadow/shadow.store'
import {
  layerAppliesTo,
  resolveBoxShadowStyle,
  resolveDropShadowFilter,
  resolveLightOverlayStyle,
  shadowScaleForSize
} from '@views/image-studio/utils/shadowVisual'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'

const PREVIEW_EDGE = 56

const mergeBoxShadows = (layers: ShadowLayer[], scale: number) => {
  const parts = layers
    .map(layer =>
      resolveBoxShadowStyle({
        type: layer.type,
        opacity: layer.opacity,
        blur: layer.blur,
        spread: layer.spread,
        color: layer.color,
        position: layer.position,
        scale
      })
    )
    .filter(Boolean) as string[]
  return parts.length ? parts.join(', ') : undefined
}

const mergeDropFilters = (layers: ShadowLayer[], scale: number) => {
  const parts = layers
    .map(layer =>
      resolveDropShadowFilter({
        type: layer.type,
        opacity: layer.opacity,
        blur: layer.blur,
        spread: layer.spread,
        color: layer.color,
        position: layer.position,
        scale
      })
    )
    .filter(Boolean) as string[]
  return parts.length ? parts.join(' ') : undefined
}

const mergeLightOverlays = (layers: LightLayer[]): CSSProperties[] =>
  layers
    .map(layer =>
      resolveLightOverlayStyle({
        lightType: layer.type,
        lightOpacity: layer.opacity,
        lightSize: layer.size,
        lightColor: layer.color,
        lightFocus: layer.focus
      })
    )
    .filter(Boolean) as CSSProperties[]

export const useShadowVisualStyles = (slotId: string, edgePx = 280) => {
  const scale = shadowScaleForSize(edgePx)

  const boxShadow = useShadowStore(s => {
    const shadows = s.shadowLayers.filter(layer => layerAppliesTo(layer.targetIds, slotId))
    return mergeBoxShadows(shadows, scale) ?? ''
  })

  const dropShadowFilter = useShadowStore(s => {
    const shadows = s.shadowLayers.filter(layer => layerAppliesTo(layer.targetIds, slotId))
    return mergeDropFilters(shadows, scale) ?? ''
  })

  const lightSignature = useShadowStore(s =>
    s.lightLayers
      .filter(layer => layerAppliesTo(layer.targetIds, slotId))
      .map(
        layer =>
          `${layer.id}:${layer.type}:${layer.opacity}:${layer.size}:${layer.color}:${layer.focus.x}:${layer.focus.y}`
      )
      .join('|')
  )

  const lightOverlays = useMemo(() => {
    const lights = useShadowStore
      .getState()
      .lightLayers.filter(layer => layerAppliesTo(layer.targetIds, slotId))
    return mergeLightOverlays(lights)
  }, [lightSignature, slotId])

  return {
    boxShadow: boxShadow || undefined,
    dropShadowFilter: dropShadowFilter || undefined,
    lightOverlays
  }
}

export const useActiveLayerPreview = () => {
  const scale = shadowScaleForSize(PREVIEW_EDGE)
  const shadow = useShadowStore(getActiveShadow)
  const light = useShadowStore(getActiveLight)

  return {
    shadow,
    light,
    boxShadow: shadow
      ? resolveBoxShadowStyle({
          type: shadow.type,
          opacity: shadow.opacity,
          blur: shadow.blur,
          spread: shadow.spread,
          color: shadow.color,
          position: shadow.position,
          scale
        })
      : undefined,
    dropShadowFilter: shadow
      ? resolveDropShadowFilter({
          type: shadow.type,
          opacity: shadow.opacity,
          blur: shadow.blur,
          spread: shadow.spread,
          color: shadow.color,
          position: shadow.position,
          scale
        })
      : undefined,
    lightOverlay: light
      ? resolveLightOverlayStyle({
          lightType: light.type,
          lightOpacity: light.opacity,
          lightSize: light.size,
          lightColor: light.color,
          lightFocus: light.focus
        })
      : undefined
  }
}
