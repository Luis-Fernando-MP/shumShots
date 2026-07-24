'use client'

import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import { ChevronDownIcon } from 'lucide-react'
import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'

export interface SliceContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode
  /** Collapsed max height in px. @default 120 */
  maxHeight?: number
  /** Expanded max height in px. Omit for uncapped content height. */
  extendedMaxHeight?: number
  /** Start expanded. @default false */
  defaultOpen?: boolean
  /** Controlled open state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** @deprecated Prefer `onOpenChange`. */
  onExtend?: () => void
  expandLabel?: string
  collapseLabel?: string
  /** Hide the toggle when content fits without clipping. @default true */
  hideToggleWhenFit?: boolean
}

/** Clippable content region with fade mask and expand/collapse control. */
const SliceContainer = ({
  children,
  className,
  maxHeight = 120,
  extendedMaxHeight,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  onExtend,
  expandLabel = 'Ver más',
  collapseLabel = 'Ver menos',
  hideToggleWhenFit = true,
  ...props
}: SliceContainerProps) => {
  const contentId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [overflows, setOverflows] = useState(false)

  const isControlled = openProp !== undefined
  const isOpen = isControlled ? Boolean(openProp) : uncontrolledOpen

  const measure = useCallback(() => {
    const node = contentRef.current
    if (!node) return
    setOverflows(node.scrollHeight > maxHeight + 1)
  }, [maxHeight])

  useEffect(() => {
    measure()
    const node = contentRef.current
    if (!node || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => measure())
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure, children])

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
    onExtend?.()
  }

  const showToggle = !hideToggleWhenFit || overflows || isOpen
  const collapsedMax = `${maxHeight}px`
  const expandedMax = extendedMaxHeight != null ? `${extendedMaxHeight}px` : undefined

  return (
    <div className='relative flex min-w-0 flex-col gap-1.5' {...props}>
      <div
        ref={contentRef}
        id={contentId}
        className={cn(
          'scrollbar-hidden min-w-0 transition-[max-height] duration-300 ease-out',
          isOpen ? 'overflow-y-auto' : 'overflow-hidden',
          !isOpen && overflows && '[mask-image:linear-gradient(to_bottom,black_40%,transparent)]',
          className
        )}
        style={{
          maxHeight: isOpen ? expandedMax : collapsedMax
        }}
      >
        {children}
      </div>

      {showToggle && (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setOpen(!isOpen)}
          className={cn(
            'text-muted-foreground hover:text-foreground h-7 w-fit justify-start gap-1.5 self-start rounded-md px-2 text-xs font-medium',
            'hover:bg-muted/50'
          )}
        >
          {isOpen ? collapseLabel : expandLabel}
          <ChevronDownIcon
            className={cn('size-3.5 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
            aria-hidden
          />
        </Button>
      )}
    </div>
  )
}

export { SliceContainer }
export default SliceContainer
