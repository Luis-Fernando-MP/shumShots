import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import type { FC, MouseEvent } from 'react'

interface Props {
  value: number
  label: string
  selected: boolean
  onClick: (e: MouseEvent) => void
}

/**
 * Icono de radio: una esquina dibuja el valor.
 *
 * @param props.value - Radio visual de la esquina (px en el thumb).
 * @param props.label - Nombre accesible del preset.
 * @param props.selected - Si este preset está activo.
 * @param props.onClick - Aplica el preset.
 */
const IndividualDefaultBorder: FC<Props> = ({ value, onClick, label, selected }) => (
  <button
    type='button'
    aria-label={label}
    aria-pressed={selected}
    className={cn('grid size-8 place-content-center', chromeTile(selected))}
    onClick={onClick}
  >
    <span
      className='border-foreground/55 size-4 border-2'
      style={{ borderRadius: `${Math.min(8, value * 0.1)}px` }}
    />
  </button>
)

export default IndividualDefaultBorder
