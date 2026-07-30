'use client'

import Switch from '@common/ui/Switch'
import Typography from '@common/ui/Typography'
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
      <div className='flex items-center justify-between gap-3'>
        <Typography.Small tone='secondary' className='text-xs leading-relaxed'>
          {canLink
            ? active
              ? 'Unido · solo capas activas'
              : 'Desunido · cada foco aparte'
            : 'Necesitas sombra y luz con estilo'}
        </Typography.Small>
        <Switch
          size='sm'
          on={active}
          disabled={!canLink}
          onChange={() => {
            if (!canLink) return
            setLinkFocus(tabId, !linkFocus)
          }}
        />
      </div>
    </SectionBlock>
  )
}

export default LinkFocusBuilder
