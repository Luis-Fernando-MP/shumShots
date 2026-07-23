import IconButton from '@/shared/ui/IconButton'
import { MoreHorizontalIcon } from 'lucide-react'
import { type FC, type HTMLAttributes, type ReactNode, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  maxHeight?: number
  onExtend?: () => void
  extendedMaxHeight?: number
}

/**
 * @description Component that allows you to extend and contract a content container.
 * @param {ReactNode} children - The child elements that will be displayed inside the container.
 * @param {number} maxHeight - The maximum height of the container when it is contracted.
 * @param {() => void} onExtend - The function that will be executed when the extension button is clicked.
 * @param {number} extendedMaxHeight - The maximum height of the container when it is extended.
 * @param {HTMLAttributes<HTMLDivElement>} props - Additional properties of the component.
 */

const SliceContainer: FC<Props> = ({ children, maxHeight, className, onExtend, extendedMaxHeight, ...props }) => {
  const [isExtended, setIsExtended] = useState(false)
  const exMaxHeight = extendedMaxHeight ? `${extendedMaxHeight}px` : '100%'

  const handleClick = () => {
    setIsExtended(!isExtended)
    onExtend?.()
  }

  return (
    <article className='relative flex min-w-fit flex-col gap-2' {...props}>
      <IconButton onClick={handleClick} className='sticky top-0 z-10'>
        {isExtended ? 'Contraer' : 'Extender'}
        <MoreHorizontalIcon />
      </IconButton>

      <section
        className={`[scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
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
