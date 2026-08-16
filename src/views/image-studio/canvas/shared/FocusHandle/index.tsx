'use client'

import { cn } from '@common/utils/cn'
import { SunIcon } from 'lucide-react'
import {
  type FC,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useRef
} from 'react'

const SUN_MARGIN = 0.06
const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))

type Props = {
  hostRef: RefObject<HTMLElement | null>
  x: number
  y: number
  label: string
  active?: boolean
  onMove: (x: number, y: number) => void
}

/**
 * Sol arrastrable sobre el shot. Mismo gesto que el pad; se oculta al capturar.
 *
 * @param props.hostRef - Caja que acota el gesto (canvas o slot).
 * @param props.x - Posición X 0–1.
 * @param props.y - Posición Y 0–1.
 * @param props.label - Nombre accesible del control.
 * @param props.onMove - Nueva posición normalizada.
 */
const FocusHandle: FC<Props> = ({ hostRef, x, y, label, active = false, onMove }) => {
  const dragging = useRef(false)
  const pending = useRef<{ x: number; y: number } | null>(null)
  const rafId = useRef(0)

  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    },
    []
  )

  const flush = () => {
    rafId.current = 0
    const next = pending.current
    if (!next) return
    onMove(next.x, next.y)
  }

  const queue = (next: { x: number; y: number }) => {
    pending.current = next
    if (!rafId.current) rafId.current = requestAnimationFrame(flush)
  }

  const readPoint = (event: ReactPointerEvent) => {
    const host = hostRef.current
    if (!host) return null
    const rect = host.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null
    return {
      x: clamp01((event.clientX - rect.left) / rect.width, SUN_MARGIN),
      y: clamp01((event.clientY - rect.top) / rect.height, SUN_MARGIN)
    }
  }

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragging.current = false
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
    if (pending.current) {
      onMove(pending.current.x, pending.current.y)
      pending.current = null
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <button
      type='button'
      aria-label={label}
      data-capture-hide
      className={cn(
        'pointer-events-auto absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-md',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-foreground border-border'
      )}
      style={{ left: `${x * 100}%`, top: `${y * 100}%`, cursor: 'grab' }}
      onClick={event => event.stopPropagation()}
      onPointerDown={event => {
        event.stopPropagation()
        event.preventDefault()
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        const next = readPoint(event)
        if (next) {
          pending.current = next
          onMove(next.x, next.y)
        }
      }}
      onPointerMove={event => {
        if (!dragging.current) return
        event.stopPropagation()
        const next = readPoint(event)
        if (next) queue(next)
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <SunIcon className='size-3.5' />
    </button>
  )
}

export default FocusHandle
