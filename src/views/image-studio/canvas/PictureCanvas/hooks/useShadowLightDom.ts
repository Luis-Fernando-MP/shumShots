'use client'

import useBoardStore from '@common/components/Board/board.store'
import APP_Z_INDEX from '@common/constants/z-index'
import useShadowStore, {
  createDefaultShadowConfig
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { resolveLightOverlayStyle, type LightLayer } from '@views/image-studio/Popups/common/presets/light'
import {
  resolveBoxShadowStyle,
  resolveDropShadowFilter,
  resolveFrameFillBoxShadow,
  type ShadowLayer
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/presets/shadow'
import { shadowScaleForSize } from '@views/image-studio/Popups/common/lib/fx-shared/targeting'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { resolveTabConfig } from '@views/image-studio/Popups/common/components/tabs/resolveTabConfig'
import type { CSSProperties, RefObject } from 'react'
import { useLayoutEffect } from 'react'

export type SlotShadowFx = {
  boxShadow: string
  dropShadowFilter: string
  frameFillBoxShadow: string
  lightOverlays: CSSProperties[]
}

const dropShadowStopsForBoardScale = (boardScale: number) => {
  if (boardScale >= 1.75) return 1
  if (boardScale >= 1.3) return 2
  return 5
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

const mergeDropFilters = (layers: ShadowLayer[], scale: number, maxStops: number) => {
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
        maxStops
      )
    )
    .filter(Boolean) as string[]
  return parts.join(' ')
}

const mergeFrameFillBoxShadows = (layers: ShadowLayer[], scale: number) => {
  const parts = layers
    .map(layer =>
      resolveFrameFillBoxShadow({
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
  boardScale = 1,
  state = useShadowStore.getState()
): SlotShadowFx => {
  const sizeScale = shadowScaleForSize(edgePx)
  const filterScale = sizeScale / Math.max(1, boardScale)
  const config = state.resolveForSlot(slotId)
  const shadows = config.shadowLayers
  const lights = config.lightLayers
  return {
    boxShadow: mergeBoxShadows(shadows, sizeScale),
    dropShadowFilter: mergeDropFilters(shadows, filterScale, dropShadowStopsForBoardScale(boardScale)),
    frameFillBoxShadow: mergeFrameFillBoxShadows(shadows, sizeScale),
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
      node.className = 'pointer-events-none absolute inset-0'
      node.style.zIndex = String(APP_Z_INDEX.slot.light)
      container.appendChild(node)
    }
    node.style.backgroundImage = typeof style.backgroundImage === 'string' ? style.backgroundImage : ''
    node.style.mixBlendMode = typeof style.mixBlendMode === 'string' ? style.mixBlendMode : 'normal'
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
    let rafId = 0
    let paintScheduled = false
    const fallbackConfig = createDefaultShadowConfig()

    const paint = () => {
      paintScheduled = false
      const boardScale = useBoardStore.getState().scale
      const fx = computeSlotShadowFx(slotId, edgePx, boardScale)
      const filterEl = filterTarget
      const boxEl = boxShadowRef.current

      const key = [
        hasDeviceFrame ? 'drop' : 'box',
        filterEl ? 'img' : 'noimg',
        boardScale.toFixed(3),
        baseBoxShadow,
        fx.boxShadow,
        fx.dropShadowFilter,
        fx.frameFillBoxShadow,
        fx.lightOverlays.map(item => `${item.backgroundImage}|${item.mixBlendMode}`).join(';')
      ].join('|')

      if (key === prevKey) return
      prevKey = key

      const root = rootRef.current
      if (root) root.style.overflow = 'visible'

      if (hasDeviceFrame) {
        if (boxEl) {
          boxEl.style.boxShadow = [baseBoxShadow, fx.frameFillBoxShadow].filter(Boolean).join(', ') || 'none'
          boxEl.style.overflow = 'visible'
        }
        if (filterEl) {
          filterEl.style.filter = fx.dropShadowFilter || 'none'
          filterEl.style.willChange = 'auto'
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

    const schedulePaint = () => {
      if (paintScheduled) return
      paintScheduled = true
      rafId = requestAnimationFrame(() => {
        rafId = 0
        paint()
      })
    }

    const shouldPaintForShadowState = (
      nextState: ReturnType<typeof useShadowStore.getState>,
      prevState: ReturnType<typeof useShadowStore.getState>
    ) => {
      const layers = getTabsStore(TABS_SCOPES.shadow).getState().layers
      const nextConfig = resolveTabConfig(layers, nextState.byTab, slotId, fallbackConfig)
      const prevConfig = resolveTabConfig(layers, prevState.byTab, slotId, fallbackConfig)
      return nextConfig.shadowLayers !== prevConfig.shadowLayers || nextConfig.lightLayers !== prevConfig.lightLayers
    }

    paint()
    let boardScaleTimer: ReturnType<typeof setTimeout> | null = null
    const unsubShadow = useShadowStore.subscribe((state, prev) => {
      if (!shouldPaintForShadowState(state, prev)) return
      schedulePaint()
    })
    const tabsStore = getTabsStore(TABS_SCOPES.shadow)
    const unsubTabs = tabsStore.subscribe((state, prev) => {
      if (state.layers === prev.layers) return
      schedulePaint()
    })
    const unsubBoard = useBoardStore.subscribe((state, prev) => {
      if (state.scale === prev.scale) return
      // Evita repintar drop-shadow en cada tick del zoom (tirones/parpadeos).
      if (boardScaleTimer != null) clearTimeout(boardScaleTimer)
      boardScaleTimer = setTimeout(() => {
        boardScaleTimer = null
        schedulePaint()
      }, 120)
    })
    return () => {
      unsubShadow()
      unsubTabs()
      unsubBoard()
      if (boardScaleTimer != null) clearTimeout(boardScaleTimer)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [baseBoxShadow, boxShadowRef, edgePx, filterTarget, hasDeviceFrame, lightsRef, rootRef, slotId])
}
