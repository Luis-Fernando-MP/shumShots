'use client'

import useShadowStore, {
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
import type { CSSProperties, RefObject } from 'react'
import { useLayoutEffect } from 'react'

export type SlotShadowFx = {
  boxShadow: string
  dropShadowFilter: string
  lightOverlays: CSSProperties[]
}

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
  return parts.join(', ')
}

const mergeDropFilters = (layers: ShadowLayer[], scale: number) => {
  const parts = layers
    .map(layer =>
      resolveDropShadowFilter(
        {
          type: layer.type,
          opacity: layer.opacity,
          blur: layer.blur,
          spread: layer.spread,
          color: layer.color,
          position: layer.position,
          scale
        },
        3
      )
    )
    .filter(Boolean) as string[]
  return parts.join(' ')
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

export const computeSlotShadowFx = (
  slotId: string,
  edgePx: number,
  state = useShadowStore.getState()
): SlotShadowFx => {
  const scale = shadowScaleForSize(edgePx)
  const shadows = state.shadowLayers.filter(layer => layerAppliesTo(layer.targetIds, slotId))
  const lights = state.lightLayers.filter(layer => layerAppliesTo(layer.targetIds, slotId))
  return {
    boxShadow: mergeBoxShadows(shadows, scale),
    dropShadowFilter: mergeDropFilters(shadows, scale),
    lightOverlays: mergeLightOverlays(lights)
  }
}

const syncLightOverlays = (container: HTMLElement | null, overlays: CSSProperties[]) => {
  if (!container) return

  while (container.childElementCount > overlays.length) {
    container.lastElementChild?.remove()
  }

  overlays.forEach((style, index) => {
    let node = container.children[index] as HTMLElement | undefined
    if (!node) {
      node = document.createElement('div')
      node.className = 'pointer-events-none absolute inset-0 z-[1]'
      container.appendChild(node)
    }
    node.style.backgroundImage = typeof style.backgroundImage === 'string' ? style.backgroundImage : ''
    node.style.mixBlendMode =
      typeof style.mixBlendMode === 'string' ? style.mixBlendMode : 'normal'
    node.style.pointerEvents = 'none'
  })
}

type BindArgs = {
  slotId: string
  edgePx: number
  hasDeviceFrame: boolean
  baseBoxShadow: string
  filterTarget: HTMLImageElement | null
  rootRef: RefObject<HTMLElement | null>
  boxShadowRef: RefObject<HTMLElement | null>
  lightsRef: RefObject<HTMLElement | null>
}

export const useShadowLightDom = ({
  slotId,
  edgePx,
  hasDeviceFrame,
  baseBoxShadow,
  filterTarget,
  rootRef,
  boxShadowRef,
  lightsRef
}: BindArgs) => {
  useLayoutEffect(() => {
    let prevKey = ''

    const paint = () => {
      const fx = computeSlotShadowFx(slotId, edgePx)
      const filterEl = filterTarget
      const boxEl = boxShadowRef.current

      const key = [
        hasDeviceFrame ? 'drop' : 'box',
        filterEl ? 'img' : 'noimg',
        baseBoxShadow,
        fx.boxShadow,
        fx.dropShadowFilter,
        fx.lightOverlays.map(item => `${item.backgroundImage}|${item.mixBlendMode}`).join(';')
      ].join('|')

      if (key === prevKey) return
      prevKey = key

      const root = rootRef.current
      if (root) root.style.overflow = 'visible'

      if (hasDeviceFrame) {
        if (boxEl) {
          boxEl.style.boxShadow = 'none'
          boxEl.style.overflow = 'visible'
        }
        if (filterEl) {
          filterEl.style.filter = fx.dropShadowFilter || 'none'
          filterEl.style.willChange = fx.dropShadowFilter ? 'filter' : 'auto'
        }
      } else {
        if (boxEl) {
          boxEl.style.boxShadow = [baseBoxShadow, fx.boxShadow].filter(Boolean).join(', ') || 'none'
          boxEl.style.overflow = 'visible'
        }
        if (filterEl) {
          filterEl.style.filter = 'none'
          filterEl.style.willChange = 'auto'
        }
      }

      syncLightOverlays(lightsRef.current, fx.lightOverlays)
    }

    paint()
    return useShadowStore.subscribe(paint)
  }, [
    baseBoxShadow,
    boxShadowRef,
    edgePx,
    filterTarget,
    hasDeviceFrame,
    lightsRef,
    rootRef,
    slotId
  ])
}
