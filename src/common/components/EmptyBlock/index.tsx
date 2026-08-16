import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import { CircleOffIcon } from 'lucide-react'
import type { FC, MouseEvent } from 'react'

interface Props {
  onClick: (e: MouseEvent) => void
  className?: string
  selected: boolean
}

const EmptyBlock: FC<Props> = ({ onClick, className = '', selected }) => {
  return (
    <button type='button' className={cn('aspect-[4/3] w-full', className)} onClick={onClick}>
      <div
        className={cn('grid size-full place-content-center [&>svg]:size-5', chromeTile(selected))}
      >
        <CircleOffIcon className='text-muted-foreground' />
      </div>
    </button>
  )
}

export default EmptyBlock
