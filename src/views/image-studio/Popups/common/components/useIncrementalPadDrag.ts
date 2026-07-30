'use client'

import { type PointerEvent as ReactPointerEvent, useRef } from 'react'

export const releasePointerCapture = (event: ReactPointerEvent<HTMLElement>) => {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

export const useIncrementalPadDrag = (onDelta: (dxPct: number, dyPct: number) => void) => {
  const padRef = useRef<HTMLDivElement>(null)
  const lastRef = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    lastRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !padRef.current) return
    const rect = padRef.current.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const dxPct = ((event.clientX - lastRef.current.x) / rect.width) * 100
    const dyPct = ((event.clientY - lastRef.current.y) / rect.height) * 100
    lastRef.current = { x: event.clientX, y: event.clientY }
    onDelta(dxPct, dyPct)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    releasePointerCapture(event)
  }

  return {
    padRef,
    padHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp
    }
  }
}
