'use client'

import useShadowStore, {
  getActiveLight,
  getActiveShadow
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import { resolveLightOverlayStyle } from '@views/image-studio/Popups/common/presets/light'
import { resolveBoxShadowStyle, resolveDropShadowFilter } from '@views/image-studio/Popups/CanvasImages/ShadowLight/presets/shadow'
import { shadowScaleForSize } from '@views/image-studio/Popups/common/lib/fx-shared/targeting'

const PREVIEW_EDGE = 56

export const useActiveLayerPreview = (tabId: string) => {
  const scale = shadowScaleForSize(PREVIEW_EDGE)
  const shadow = useShadowStore(getActiveShadow(tabId))
  const light = useShadowStore(getActiveLight(tabId))

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
