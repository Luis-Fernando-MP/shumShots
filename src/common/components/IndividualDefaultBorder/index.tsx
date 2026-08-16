import { acl } from '@common/lib/acl'
import type { FC, MouseEvent } from 'react'

interface Props {
  value: number
  label: string
  selected: boolean
  onClick: (e: MouseEvent) => void
}

/**
 * @description Represents an individual border that can be selected.
 * @param value - The value that determines the style of the border radius.
 * @param label - The label displayed on the button.
 * @param selected - Indicates whether this border is selected.
 * @param onClick - Function that is executed when the button is clicked.
 */

const IndividualDefaultBorder: FC<Props> = ({ value, onClick, label, selected }) => {
  return (
    <button className={`flex w-[100px] select-none flex-col items-center rounded-lg bg-background px-1 pb-1 pt-2 ${acl(selected, 'bg-primary')}`} onClick={onClick}>
      <div className='relative h-[60px] w-[55px]'>
        <div className='size-full rounded-lg bg-card brightness-95' />
        <div className='absolute -right-[10px] -top-[3px] h-[50px] w-[40px] origin-top-right rotate-[10deg] border-b-2 border-l-2 border-primary/30 bg-muted brightness-125 shadow-[-15px_10px_15px_-4px_rgb(0_0_0_/_20%)]' style={{ borderBottomLeftRadius: value }} />
      </div>
      <h5 className={selected ? 'text-primary-foreground' : 'text-muted-foreground'}>{label}</h5>
    </button>
  )
}

export default IndividualDefaultBorder
