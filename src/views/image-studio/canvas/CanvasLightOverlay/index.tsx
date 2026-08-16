'use client'

import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import APP_Z_INDEX from '@common/constants/z-index'
import { resolveLightOverlayStyle } from '@views/image-studio/Popups/common/presets/light'
import { type CSSProperties, type FC, useMemo } from 'react'

const CanvasLightOverlay: FC = () => {
  const layers = useCanvasLightStore(s => s.layers)
  const stackMode = useCanvasLightStore(s => s.stackMode)

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

  if (overlays.length === 0) return null

  return (
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
  )
}

export default CanvasLightOverlay
