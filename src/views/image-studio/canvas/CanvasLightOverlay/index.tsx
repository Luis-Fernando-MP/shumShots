'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { normalizeLightType, resolveLightOverlayStyle } from '@views/image-studio/Popups/common/presets/light'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import { applyCanvasLightFocus } from '@views/image-studio/Popups/Canvas/Light/utils/applyFocus'
import FocusHandle from '@views/image-studio/canvas/shared/FocusHandle'
import { type CSSProperties, type FC, useMemo, useRef } from 'react'

const CanvasLightOverlay: FC = () => {
  const layers = useCanvasLightStore(s => s.layers)
  const activeId = useCanvasLightStore(s => s.activeId)
  const stackMode = useCanvasLightStore(s => s.stackMode)
  const hostRef = useRef<HTMLDivElement>(null)

  const overlays = useMemo(
    () =>
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
        .filter(Boolean) as CSSProperties[],
    [layers]
  )

  const movable = layers.filter(layer => normalizeLightType(layer.type) !== 'none')

  if (overlays.length === 0 && movable.length === 0) return null

  return (
    <>
      {overlays.length > 0 && (
        <div
          className='pointer-events-none absolute inset-0'
          style={{
            zIndex:
              stackMode === 'above' ? APP_Z_INDEX.canvas.lightAbove : APP_Z_INDEX.canvas.lightBelow
          }}
          aria-hidden
        >
          {overlays.map((style, index) => (
            <div key={index} className='absolute inset-0' style={style} />
          ))}
        </div>
      )}
      {movable.length > 0 && (
        <div
          ref={hostRef}
          data-capture-hide
          className='pointer-events-none absolute inset-0'
          style={{ zIndex: APP_Z_INDEX.canvas.gizmo }}
        >
          {movable.map(layer => (
            <FocusHandle
              key={layer.id}
              hostRef={hostRef}
              x={layer.focus.x}
              y={layer.focus.y}
              active={layer.id === activeId}
              label={`Mover ${layer.label}`}
              onMove={(x, y) => applyCanvasLightFocus(x, y, layer.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default CanvasLightOverlay
