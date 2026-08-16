'use client'

import { cn } from '@common/utils/cn'
import { SunIcon } from 'lucide-react'
import {
  type CSSProperties,
  type FC,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'

export type FocusSun = { x: number; y: number }

const SUN_MARGIN = 0.06
const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))
const nearlySame = (a: FocusSun, b: FocusSun) => Math.abs(a.x - b.x) < 1e-4 && Math.abs(a.y - b.y) < 1e-4

type Props = {
  sun: FocusSun
  disabled?: boolean
  overlay?: CSSProperties | null
  dummyStyle?: CSSProperties
  padClassName?: string
  onMove: (x: number, y: number) => void
  children?: ReactNode
}

/**
 * Pad 1:1 con sol arrastrable. El store mapea `onMove` a foco o sombra.
 *
 * @param props.sun - Posición normalizada 0–1.
 * @param props.onMove - Callback con la nueva posición.
 */
const FocusPad: FC<Props> = ({ sun, disabled = false, overlay, dummyStyle, padClassName, onMove }) => {
  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pending = useRef<FocusSun | null>(null)
  const rafId = useRef(0)
  const [dragSun, setDragSun] = useState<FocusSun | null>(null)
  const shown = dragSun ?? sun

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

  const queue = (next: FocusSun) => {
    pending.current = next
    if (!rafId.current) rafId.current = requestAnimationFrame(flush)
  }

  const moveSun = (event: ReactPointerEvent) => {
    const pad = padRef.current
    if (!pad || disabled) return
    const rect = pad.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const next = {
      x: clamp01((event.clientX - rect.left) / rect.width, SUN_MARGIN),
      y: clamp01((event.clientY - rect.top) / rect.height, SUN_MARGIN)
    }
    setDragSun(prev => (prev && nearlySame(prev, next) ? prev : next))
    queue(next)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
    if (pending.current) {
      onMove(pending.current.x, pending.current.y)
      pending.current = null
    }
    setDragSun(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      ref={padRef}
      className={cn(
        'ring-border/40 relative mx-auto flex aspect-square w-full touch-none items-center justify-center overflow-hidden rounded-[12px] ring-1 ring-inset',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair',
        padClassName
      )}
      onPointerDown={event => {
        if (disabled) return
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        moveSun(event)
      }}
      onPointerMove={event => {
        if (!dragging.current || disabled) return
        moveSun(event)
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {overlay && <div className='pointer-events-none absolute inset-0' style={overlay} />}
      <div className='bg-primary/45 pointer-events-none relative z-[1] size-14 rounded-md' style={dummyStyle} />
      <div
        className='bg-card text-foreground pointer-events-none absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border'
        style={{ left: `${shown.x * 100}%`, top: `${shown.y * 100}%` }}
      >
        <SunIcon className='size-3.5' />
      </div>
    </div>
  )
}

export default FocusPad
