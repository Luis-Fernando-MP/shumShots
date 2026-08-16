'use client'

import SwitchRow from '@views/image-studio/Popups/common/components/SwitchRow'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useShadowStore, {
  getActiveLight,
  getActiveShadow
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import { type FC } from 'react'

type Props = { tabId: string }

const LinkFocusBuilder: FC<Props> = ({ tabId }) => {
  const linkFocus = useShadowStore(s => s.byTab[tabId]?.linkFocus ?? false)
  const setLinkFocus = useShadowStore(s => s.setLinkFocus)
  const shadow = useShadowStore(getActiveShadow(tabId))
  const light = useShadowStore(getActiveLight(tabId))

  const canLink = shadow.type !== 'none' && light.type !== 'none'
  const active = canLink && linkFocus

  return (
    <SectionBlock
      title='Unir foco'
      description={
        canLink
          ? 'Mueve juntos el foco de las capas activas de sombra y luz.'
          : 'Elige un estilo distinto de Limpio en sombra y luz para habilitar.'
      }
    >
      <SwitchRow
        on={active}
        disabled={!canLink}
        onChange={() => {
          if (!canLink) return
          setLinkFocus(tabId, !linkFocus)
        }}
        ariaLabel='Unir foco de sombra y luz'
      />
    </SectionBlock>
  )
}

export default LinkFocusBuilder
