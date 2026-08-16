'use client'

import { normalizeLightType } from '@views/image-studio/Popups/common/presets/light'
import useShadowStore, {
  EMPTY_SHADOW_CONFIG
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import {
  applySlotFocus,
  sunFromShadowPosition
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/utils/applyFocus'
import FocusHandle from '@views/image-studio/canvas/shared/FocusHandle'
import { type FC, type RefObject } from 'react'

type Props = {
  tabId: string
  hostRef: RefObject<HTMLElement | null>
}

/**
 * Soles de luz y sombra sobre el slot. La sombra no sale del cuadrado.
 *
 * @param props.tabId - Destino sombra/luz del slot.
 * @param props.hostRef - Caja del slot (acota la sombra).
 */
const SlotFocusGizmos: FC<Props> = ({ tabId, hostRef }) => {
  const config = useShadowStore(s => s.byTab[tabId] ?? EMPTY_SHADOW_CONFIG)
  const shadow =
    config.shadowLayers.find(layer => layer.id === config.activeShadowId) ?? config.shadowLayers[0]
  const light =
    config.lightLayers.find(layer => layer.id === config.activeLightId) ?? config.lightLayers[0]
  const shadowType = shadow?.type ?? 'none'
  const lightType = light ? normalizeLightType(light.type) : 'none'
  const linked = config.linkFocus && shadowType !== 'none' && lightType !== 'none'
  const showShadow = shadowType !== 'none' && !linked
  const showLight = lightType !== 'none'
  const shadowSun = sunFromShadowPosition(shadowType, shadow?.position ?? { x: 0, y: 0 })

  if (!showShadow && !showLight) return null

  return (
    <div data-capture-hide className='pointer-events-none absolute inset-0'>
      {showLight && (
        <FocusHandle
          hostRef={hostRef}
          x={light.focus.x}
          y={light.focus.y}
          active
          label='Mover luz de la imagen'
          onMove={(x, y) => applySlotFocus(tabId, x, y, 'light')}
        />
      )}
      {showShadow && (
        <FocusHandle
          hostRef={hostRef}
          x={shadowSun.x}
          y={shadowSun.y}
          label='Mover sombra (dentro de la imagen)'
          onMove={(x, y) => applySlotFocus(tabId, x, y, 'shadow')}
        />
      )}
    </div>
  )
}

export default SlotFocusGizmos
