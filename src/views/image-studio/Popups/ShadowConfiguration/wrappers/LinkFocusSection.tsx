'use client'

import Switch from '@common/ui/Switch'
import Typography from '@common/ui/Typography'
import useShadowStore, { getActiveLight, getActiveShadow } from '@views/image-studio/Popups/ShadowConfiguration/store'
import { type FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const LinkFocusSection: FC = () => {
  const linkFocus = useShadowStore(s => s.linkFocus)
  const setLinkFocus = useShadowStore(s => s.setLinkFocus)
  const shadow = useShadowStore(getActiveShadow)
  const light = useShadowStore(getActiveLight)

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
            setLinkFocus(!linkFocus)
          }}
        />
      </div>
    </SectionBlock>
  )
}

export default LinkFocusSection
