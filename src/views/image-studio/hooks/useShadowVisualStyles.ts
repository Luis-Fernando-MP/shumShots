'use client'

import useShadowStore, {
  resolveBoxShadowStyle,
  resolveDropShadowFilter,
  resolveLightOverlayStyle
} from '@views/image-studio/store/shadow/shadow.store'
import { useMemo } from 'react'

/** Stable visual styles derived from the shadow store (avoids getSnapshot loops). */
export const useShadowVisualStyles = () => {
  const type = useShadowStore(s => s.type)
  const opacity = useShadowStore(s => s.opacity)
  const blur = useShadowStore(s => s.blur)
  const spread = useShadowStore(s => s.spread)
  const color = useShadowStore(s => s.color)
  const positionX = useShadowStore(s => s.position.x)
  const positionY = useShadowStore(s => s.position.y)

  const lightType = useShadowStore(s => s.lightType)
  const lightOpacity = useShadowStore(s => s.lightOpacity)
  const lightSize = useShadowStore(s => s.lightSize)
  const lightColor = useShadowStore(s => s.lightColor)
  const lightFocusX = useShadowStore(s => s.lightFocus.x)
  const lightFocusY = useShadowStore(s => s.lightFocus.y)

  return useMemo(() => {
    const shadowInput = {
      type,
      opacity,
      blur,
      spread,
      color,
      position: { x: positionX, y: positionY }
    }
    const lightInput = {
      lightType,
      lightOpacity,
      lightSize,
      lightColor,
      lightFocus: { x: lightFocusX, y: lightFocusY }
    }

    return {
      boxShadow: resolveBoxShadowStyle(shadowInput),
      dropShadowFilter: resolveDropShadowFilter(shadowInput),
      lightOverlay: resolveLightOverlayStyle(lightInput)
    }
  }, [
    blur,
    color,
    lightColor,
    lightFocusX,
    lightFocusY,
    lightOpacity,
    lightSize,
    lightType,
    opacity,
    positionX,
    positionY,
    spread,
    type
  ])
}
