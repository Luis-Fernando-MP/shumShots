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
    className={cn(
      'grid size-8 place-content-center rounded-[12px]',
      selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
    )}
    onClick={onClick}
  >
    <span
      className={cn('size-4 border-2', selected ? 'border-primary-foreground' : 'border-current')}
      style={{ borderRadius: `${Math.min(8, value * 0.1)}px` }}
    />
  </button>
)

export default IndividualDefaultBorder
