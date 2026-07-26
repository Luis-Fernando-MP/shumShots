'use client'

import useShadowStore, {
  getActiveLight,
  getActiveShadow
} from '@views/image-studio/Popups/ShadowConfiguration/store'
import { resolveLightOverlayStyle } from '@views/image-studio/fx/light'
import { resolveBoxShadowStyle, resolveDropShadowFilter } from '@views/image-studio/fx/shadow'
import { shadowScaleForSize } from '@views/image-studio/fx/shared/targeting'

const PREVIEW_EDGE = 56

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
