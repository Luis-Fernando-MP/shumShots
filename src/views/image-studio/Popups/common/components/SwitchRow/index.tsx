'use client'

import Switch from '@common/components/Switch'
import type { FC } from 'react'

type Props = {
  on: boolean
  onChange: () => void
  disabled?: boolean
  ariaLabel: string
}

/**
 * Fila de switch alineada a la derecha. El título vive en SectionBlock.
 *
 * @param props.on - Estado actual.
 * @param props.ariaLabel - Etiqueta accesible del switch.
 */
const SwitchRow: FC<Props> = ({ on, onChange, disabled = false, ariaLabel }) => (
  <div className='flex items-center justify-end'>
    <Switch size='sm' on={on} disabled={disabled} onChange={onChange} aria-label={ariaLabel} />
  </div>
)

export default SwitchRow
