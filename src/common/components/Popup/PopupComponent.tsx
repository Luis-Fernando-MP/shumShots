'use client'

import { cn } from '@common/utils/cn'
import {
  Children,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type TransitionEvent,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { createPortal } from 'react-dom'

import usePopup, { type PopupPositions } from './usePopup'

interface PopupContextValue {
  onTriggerClick: (e: MouseEvent) => void
  onClose: () => void
  isDragging: boolean
}

const PopupContext = createContext<PopupContextValue | null>(null)

const usePopupContext = () => {
  const context = useContext(PopupContext)
  if (!context) throw new Error('Popup compound parts must be used within Popup')
  return context
}

interface TriggerProps {
  onClick?: (e: MouseEvent) => void
}

interface PopupTriggerProps {
  children: ReactElement<TriggerProps> | ReactNode
}

const PopupTrigger = ({ children }: PopupTriggerProps) => {
  const { onTriggerClick } = usePopupContext()

  if (isValidElement<TriggerProps>(children)) {
    return cloneElement(children, {
      onClick: (e: MouseEvent) => {
        children.props.onClick?.(e)
        if (e.defaultPrevented) return
        onTriggerClick(e)
      }
    })
  }

  return (
    <span role='button' tabIndex={0} onClick={onTriggerClick}>
      {children}
    </span>
  )
}

PopupTrigger.displayName = 'Popup.Trigger'

interface PopupHeaderProps {
  children?: ReactNode
  className?: string
}

const PopupHeader = ({ children, className }: PopupHeaderProps) => {
  const { onClose, isDragging } = usePopupContext()

  return (
    <header
      className={cn(
        'border-border/50 bg-card/90 relative flex shrink-0 flex-row items-center gap-2.5 border-b px-4 py-2.5 backdrop-blur-md',
        className
      )}
      id='popup-header'
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <button type='button' className='bg-primary size-3.5 shrink-0 rounded-full' onClick={onClose} aria-label='Cerrar' />
      {typeof children === 'string' || typeof children === 'number' ? (
        <h5 className='font-display text-md leading-tight font-medium tracking-wide'>{children}</h5>
      ) : (
        children
      )}
    </header>
  )
}

PopupHeader.displayName = 'Popup.Header'

interface PopupContentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

const PopupContent = ({ children, className, ...props }: PopupContentProps) => {
  return (
    <section
      className={cn(
        'relative min-h-0 min-w-full flex-1 overflow-x-hidden overflow-y-auto px-4 py-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

PopupContent.displayName = 'Popup.Content'

interface PopupFooterProps {
  children?: ReactNode
  className?: string
}

const PopupFooter = ({ children, className }: PopupFooterProps) => {
  return (
    <footer
      className={cn(
        'border-border/50 bg-card/90 relative flex shrink-0 flex-row items-center gap-2.5 border-t px-4 py-2.5 backdrop-blur-md',
        className
      )}
    >
      {children}
    </footer>
  )
}

PopupFooter.displayName = 'Popup.Footer'

interface IPopup {
  children?: ReactNode
  className?: string
}

const EXIT_MS = 200

const isPopupPart = (child: ReactNode, type: unknown) => isValidElement(child) && child.type === type

const Popup = ({ children, className }: IPopup) => {
  const [isOpen, setIsOpen] = useState(false)
  const [clickPosition, setClickPosition] = useState<PopupPositions>({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClose = () => setIsOpen(false)

  const { setPopupRef, handleMouseDown, isDragging, isPositioned, position, blockChildren } = usePopup({
    isOpen,
    clickPosition,
    onClose: handleClose
  })

  const handleTriggerClick = (e: MouseEvent) => {
    if (isOpen) {
      setIsOpen(false)
      return
    }
    setClickPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }

  const triggers: ReactNode[] = []
  const headers: ReactNode[] = []
  const contents: ReactNode[] = []
  const footers: ReactNode[] = []

  Children.forEach(children, child => {
    if (isPopupPart(child, PopupTrigger)) {
      triggers.push(child)
      return
    }
    if (isPopupPart(child, PopupHeader)) {
      headers.push(child)
      return
    }
    if (isPopupPart(child, PopupContent)) {
      contents.push(child)
      return
    }
    if (isPopupPart(child, PopupFooter)) {
      footers.push(child)
    }
  })

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      return
    }

    setVisible(false)

    const timeout = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    if (!mounted || !isOpen || !isPositioned) return

    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [mounted, isOpen, isPositioned])

  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== 'opacity') return
    if (!isOpen) setMounted(false)
  }

  return (
    <PopupContext.Provider value={{ onTriggerClick: handleTriggerClick, onClose: handleClose, isDragging }}>
      {triggers}
      {mounted &&
        createPortal(
          <article
            role='dialog'
            aria-modal='false'
            tabIndex={0}
            ref={setPopupRef}
            id='popup'
            data-state={visible ? 'open' : 'closed'}
            onMouseDown={handleMouseDown}
            onTransitionEnd={handleTransitionEnd}
            className={cn(
              'popup border-border/40 bg-card/80 fixed z-10 flex min-h-[300px] min-w-[200px] flex-col overflow-hidden rounded-lg border backdrop-blur-md select-none',
              'origin-top-left transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform]',
              visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-[0.97] opacity-0',
              blockChildren && '[&_*]:pointer-events-none',
              className
            )}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`
            }}
          >
            {headers}
            {contents}
            {footers}
          </article>,
          document.body
        )}
    </PopupContext.Provider>
  )
}

Popup.Trigger = PopupTrigger
Popup.Header = PopupHeader
Popup.Content = PopupContent
Popup.Footer = PopupFooter

export default Popup
