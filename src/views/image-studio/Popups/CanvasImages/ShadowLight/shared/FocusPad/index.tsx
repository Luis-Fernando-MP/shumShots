'use client'

import { normalizeLightType } from '@views/image-studio/Popups/common/presets/light'
import { useActiveLayerPreview } from '@views/image-studio/canvas/PictureCanvas/hooks/useShadowVisualStyles'
import FocusPad from '@views/image-studio/Popups/common/components/FocusPad'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useShadowStore from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import {
  applySlotFocus,
  sunFromShadowPosition,
  type SlotFocusKind
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/utils/applyFocus'
import { type FC } from 'react'

const SlotFocusPad: FC<{ kind: SlotFocusKind; tabId: string }> = ({ kind, tabId }) => {
  const { shadow, light, boxShadow, lightOverlay } = useActiveLayerPreview(tabId)
  const shadowType = shadow?.type ?? 'none'
  const lightType = light ? normalizeLightType(light.type) : 'none'
  const disabled = kind === 'shadow' ? shadowType === 'none' : lightType === 'none'
  const linkFocus = useShadowStore(s => s.byTab[tabId]?.linkFocus ?? false)
  const linked = linkFocus && shadowType !== 'none' && lightType !== 'none'

  const sun =
    kind === 'shadow'
      ? sunFromShadowPosition(shadowType, shadow?.position ?? { x: 0, y: 0 })
      : { x: light?.focus.x ?? 0.55, y: light?.focus.y ?? 0.28 }

  let description = 'Mueve la luz en el pad o sobre la imagen.'
  if (kind === 'shadow') {
    description = 'La sombra se queda en el cuadrado de la imagen. Arrástrala aquí o en el slot.'
  }
  if (linked) description = 'Foco unido: arrastra el sol en el pad o en la imagen.'

  return (
    <SectionBlock title='Foco' level={2} description={description}>
      <FocusPad
        sun={sun}
        disabled={disabled}
        overlay={kind === 'light' ? lightOverlay : null}
        dummyStyle={kind === 'shadow' ? { boxShadow } : undefined}
        padClassName={kind === 'light' ? 'bg-primary' : 'bg-muted/30'}
        onMove={(x, y) => applySlotFocus(tabId, x, y, kind)}
      />
    </SectionBlock>
  )
}

export default SlotFocusPad
