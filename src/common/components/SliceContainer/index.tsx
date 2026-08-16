'use client'

import { Button } from '@common/components/Button'
import { cn } from '@common/utils/cn'
import { ChevronDownIcon } from 'lucide-react'
import {
  Children,
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
  /** Classes applied only while expanded (e.g. larger gap). */
  expandedClassName?: string
  /** Items visible in the collapsed clip; used to compute `+N más`. */
  collapsedVisible?: number
  /** Hide the toggle when content fits without clipping. @default true */
  hideToggleWhenFit?: boolean
}

/**
 * Región recortable con máscara y control `+N más`.
 *
 * @param props.maxHeight - Alto colapsado en px.
 * @param props.extendedMaxHeight - Alto expandido; si se omite, el contenido crece libre.
 * @param props.expandedClassName - Clases extra al abrir (gap / columnas).
 * @param props.collapsedVisible - Ítems que caben colapsados, para el contador.
 */
const SliceContainer = ({
  children,
  className,
  maxHeight = 120,
  extendedMaxHeight,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  onExtend,
  expandLabel,
  collapseLabel = 'Menos',
  expandedClassName,
  collapsedVisible,
  hideToggleWhenFit = true,
  ...props
}: SliceContainerProps) => {
  const contentId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [overflows, setOverflows] = useState(false)

  const isControlled = openProp !== undefined
  const isOpen = isControlled ? Boolean(openProp) : uncontrolledOpen
  const childCount = Children.count(children)
  const hidden = Math.max(0, childCount - (collapsedVisible ?? 0))
  const moreLabel = expandLabel ?? (hidden > 0 ? `+${hidden} más` : 'Más')

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
          !isOpen && overflows && '[mask-image:linear-gradient(to_bottom,black_55%,transparent)]',
          className,
          isOpen && expandedClassName
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
          variant='outline'
          size='sm'
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setOpen(!isOpen)}
          className='h-8 w-full justify-center gap-1.5 rounded-[12px] px-3 text-xs'
        >
          {isOpen ? collapseLabel : moreLabel}
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
