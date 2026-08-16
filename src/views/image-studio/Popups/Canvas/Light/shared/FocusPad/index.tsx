'use client'

import { normalizeLightType, resolveLightOverlayStyle } from '@views/image-studio/Popups/common/presets/light'
import { defaultLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/initialState'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import { applyCanvasLightFocus } from '@views/image-studio/Popups/Canvas/Light/utils/applyFocus'
import type { CanvasLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
import FocusPad from '@views/image-studio/Popups/common/components/FocusPad'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { type FC } from 'react'

const selectActiveLight = (s: { layers: CanvasLightLayer[]; activeId: string }) =>
  s.layers.find(layer => layer.id === s.activeId) ?? s.layers[0] ?? defaultLightLayer(1)

const CanvasLightFocusPad: FC = () => {
  const light = useCanvasLightStore(selectActiveLight)
  const lightType = normalizeLightType(light.type)
  const disabled = lightType === 'none'

  const overlay = resolveLightOverlayStyle({
    lightType: light.type,
    lightOpacity: light.opacity,
    lightSize: light.size,
    lightColor: light.color,
    lightFocus: light.focus
  })

  return (
    <SectionBlock title='Foco' level={2} description='Mueve el sol en el pad o en el canvas.'>
      <FocusPad
        sun={{ x: light.focus.x, y: light.focus.y }}
        disabled={disabled}
        overlay={overlay}
        padClassName='bg-primary'
        onMove={applyCanvasLightFocus}
      />
    </SectionBlock>
  )
}

export default CanvasLightFocusPad
