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
}

const PopupContext = createContext<PopupContextValue | null>(null)

const usePopupContext = () => {
  const context = useContext(PopupContext)
  if (!context) throw new Error('Popup.Trigger must be used within Popup')
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

interface IPopup extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  children?: ReactNode
  title?: string
}

const EXIT_MS = 200

const Popup = ({ children, className = '', title, ...props }: IPopup) => {
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
  const content: ReactNode[] = []

  Children.forEach(children, child => {
    if (isValidElement(child) && child.type === PopupTrigger) {
      triggers.push(child)
      return
    }
    content.push(child)
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
    <PopupContext.Provider value={{ onTriggerClick: handleTriggerClick }}>
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
              'popup bg-card/50 fixed z-10 flex min-h-[300px] min-w-[200px] flex-col gap-1 overflow-hidden rounded-lg backdrop-blur-md select-none',
              'origin-top-left transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform]',
              visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-[0.97] opacity-0',
              blockChildren && '[&_*]:pointer-events-none'
            )}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`
            }}
          >
            <header
              className='relative flex flex-row items-center gap-2 p-2'
              id='popup-header'
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <button type='button' className='bg-primary size-[15px] rounded-full' onClick={handleClose} aria-label='Cerrar' />
              <p>{title}</p>
            </header>
            <section
              className={cn(
                'relative min-h-full min-w-full overflow-x-hidden overflow-y-auto p-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                className
              )}
              {...props}
            >
              {content}
            </section>
          </article>,
          document.body
        )}
    </PopupContext.Provider>
  )
}

Popup.Trigger = PopupTrigger

export default Popup
