import IndividualDefaultBorder from '@common/components/IndividualDefaultBorder'
import type { FC } from 'react'

interface Props {
  borderValue: number
  changeBorder: (value: number) => void
}

const BORDERS = [
  { radius: 0, label: 'Recto' },
  { radius: 12, label: 'Suave' },
  { radius: 20, label: 'Simple' },
  { radius: 40, label: 'Curvo' },
  { radius: 80, label: 'Circular' }
]

/**
 * Fila de presets de radio. Cada icono dibuja la esquina.
 *
 * @param props.borderValue - Radio actual.
 * @param props.changeBorder - Aplica un preset.
 */
const DefaultBorders: FC<Props> = ({ borderValue, changeBorder }) => (
  <section className='flex w-full items-center justify-between gap-1'>
    {BORDERS.map(border => (
      <IndividualDefaultBorder
        key={border.label}
        value={border.radius}
        onClick={() => changeBorder(border.radius)}
        label={border.label}
        selected={border.radius === borderValue}
      />
    ))}
  </section>
)

export default DefaultBorders
