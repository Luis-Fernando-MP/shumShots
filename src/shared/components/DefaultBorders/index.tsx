import { newKey } from '@/shared/key'
import IndividualDefaultBorder from '@/shared/ui/IndividualDefaultBorder'
import type { FC } from 'react'

interface Props {
  borderValue: number
  changeBorder: (value: number) => void
}

const borders = [
  { radius: 20, label: 'Simple' },
  { radius: 40, label: 'Curvo' },
  { radius: 80, label: 'Circular' }
]

/**
 * @description Represents a component that displays a list of border styles.
 * It allows the user to choose a border style and notifies the parent component of the change.
 * @param borderValue - The currently selected border value.
 * @param changeBorder - Function that is called when the selected border changes.
 */

const DefaultBorders: FC<Props> = ({ borderValue, changeBorder }) => {
  return (
    <section className='flex flex-row flex-wrap items-center gap-2'>
      {borders.map(border => {
        const { label, radius } = border
        return (
          <IndividualDefaultBorder
            key={newKey()}
            value={radius * 0.6}
            onClick={() => changeBorder(radius)}
            label={label}
            selected={radius === borderValue}
          />
        )
      })}
    </section>
  )
}

export default DefaultBorders
