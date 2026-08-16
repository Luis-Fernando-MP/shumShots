import IndividualDefaultBorder from '@common/components/IndividualDefaultBorder'
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

const DefaultBorders: FC<Props> = ({ borderValue, changeBorder }) => {
  return (
    <section className='grid w-full grid-cols-3 gap-1.5'>
      {borders.map(border => (
        <IndividualDefaultBorder
          key={border.label}
          value={border.radius * 0.6}
          onClick={() => changeBorder(border.radius)}
          label={border.label}
          selected={border.radius === borderValue}
        />
      ))}
    </section>
  )
}

export default DefaultBorders
