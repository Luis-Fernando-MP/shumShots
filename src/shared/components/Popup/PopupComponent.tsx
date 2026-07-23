'use client'

import { cn } from '@common/utils/cn'
import { type HTMLAttributes, type ReactNode, type TransitionEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import usePopup, { type PopupPositions } from './usePopup'

interface IPopup extends HTMLAttributes<HTMLElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  isOpen: boolean
  title?: string
  clickPosition?: PopupPositions
  onClose: () => void
}

const EXIT_MS = 200

const PopupComponent = ({
  children,
  className = '',
  isOpen,
  onClose,
  title,
  clickPosition = { x: 0, y: 0 },
  ...props
}: IPopup) => {
  const [mounted, setMounted] = useState(isOpen)
  const [visible, setVisible] = useState(false)
  const { setPopupRef, handleMouseDown, isDragging, isPositioned, position, blockChildren } = usePopup({
    isOpen,
    clickPosition,
    onClose
  })

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      return
    }

    setVisible(false)

    // Fallback si no hay transitionend (ya estaba invisible)
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

  if (!mounted) return null

  return createPortal(
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
        <button type='button' className='bg-primary size-[15px] rounded-full' onClick={onClose} aria-label='Cerrar' />
        <p>{title}</p>
      </header>
      <section
        className={cn(
          'relative min-h-full min-w-full overflow-x-hidden overflow-y-auto p-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          className
        )}
        {...props}
      >
        {children}
      </section>
    </article>,
    document.body
  )
}

export default PopupComponent
