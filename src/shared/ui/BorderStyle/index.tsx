import { acl } from '@/shared/acl'
import { defaultBorders } from '@/shared/components/BorderConfiguration'
import type { FC, MouseEvent } from 'react'

type Props = (typeof defaultBorders)[0] & { isActive: boolean; onClick: (e: MouseEvent) => void }

const BorderStyle: FC<Props> = ({ color, gradient, isActive, onClick }) => {
  return (
    <button className='h-[50px] w-[100px]' onClick={onClick}>
      <div className={`relative size-full overflow-hidden rounded-lg border-[3px] bg-background before:absolute before:left-1/2 before:top-[30%] before:size-[50px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-to-r before:from-primary before:to-secondary before:blur-lg before:opacity-60 ${acl(isActive, 'border-primary')}`}>
        <div className='absolute -right-[30%] -top-[30%] size-full border-2 border-muted rounded-bl-lg' style={{ background: color ?? gradient }} />
      </div>
    </button>
  )
}

export default BorderStyle
