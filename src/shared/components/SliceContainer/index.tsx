import Button from '@/shared/ui/Button'
import { cn } from '@common/utils/cn'
import { MoreHorizontalIcon } from 'lucide-react'
import { type FC, type HTMLAttributes, type ReactNode, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  maxHeight?: number
  onExtend?: () => void
  extendedMaxHeight?: number
}

/** Collapsible slice of content with a compact extend/collapse control. */
const SliceContainer: FC<Props> = ({ children, maxHeight, className, onExtend, extendedMaxHeight, ...props }) => {
  const [isExtended, setIsExtended] = useState(false)
  const exMaxHeight = extendedMaxHeight ? `${extendedMaxHeight}px` : '100%'

  const handleClick = () => {
    setIsExtended(!isExtended)
    onExtend?.()
  }

  return (
    <article className='relative flex min-w-0 flex-col gap-2' {...props}>
      <Button size='sm' variant='ghost' onClick={handleClick} className='text-muted-foreground self-start'>
        {isExtended ? 'Contraer' : 'Extender'}
        <MoreHorizontalIcon />
      </Button>

      <section
        className={cn('scrollbar-hidden', className)}
        style={{
          maxHeight: isExtended ? exMaxHeight : `${maxHeight}px`,
          overflow: isExtended ? 'auto' : 'hidden'
        }}
      >
        {children}
      </section>
    </article>
  )
}

export default SliceContainer
