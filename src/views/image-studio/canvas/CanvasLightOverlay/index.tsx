'use client'

import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import { resolveLightOverlayStyle } from '@views/image-studio/Popups/common/presets/light'
import { cn } from '@common/utils/cn'
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
      className={cn(
        'pointer-events-none absolute inset-0',
        stackMode === 'above' ? 'z-[20]' : 'z-[5]'
      )}
      aria-hidden
    >
      {overlays.map((style, index) => (
        <div key={index} className='absolute inset-0' style={style} />
      ))}
    </div>
  )
}

export default CanvasLightOverlay
