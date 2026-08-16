import useBoardStore from '@/shared/components/Board/board.store'
import useLayoutStore, {
  DEFAULT_SLOT_OFFSET
} from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import { SLOT_OFFSET_MAX_SHIFT } from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/type.layout'
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from 'react'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type DragState = {
  pointerId: number
  startClientX: number
  startClientY: number
  startOffsetX: number
  startOffsetY: number
}

/**
 * Alt + drag on a picture slot updates that slot's layout offset (shared with SlotMoveBuilder).
 */
const useSlotAltDrag = (slotId: string, canvasWidth: number, canvasHeight: number) => {
  const setOffsetForSlots = useLayoutStore(s => s.setOffsetForSlots)
  const drag = useRef<DragState | null>(null)
  const pending = useRef<{ x: number; y: number } | null>(null)
  const rafId = useRef(0)
  const [active, setActive] = useState(false)
  const moved = useRef(false)

  const flush = () => {
    rafId.current = 0
    const next = pending.current
    if (!next) return
    setOffsetForSlots([slotId], [slotId], next)
  }

  const queue = (next: { x: number; y: number }) => {
    pending.current = next
    if (!rafId.current) rafId.current = requestAnimationFrame(flush)
  }

  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    },
    []
  )

  const applyFromPointer = (event: ReactPointerEvent | PointerEvent) => {
    const state = drag.current
    if (!state) return
    const boardScale = Math.max(0.01, useBoardStore.getState().scale || 1)
    const dx = (event.clientX - state.startClientX) / boardScale
    const dy = (event.clientY - state.startClientY) / boardScale
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) moved.current = true

    const maxShiftX = Math.max(1, canvasWidth * SLOT_OFFSET_MAX_SHIFT)
    const maxShiftY = Math.max(1, canvasHeight * SLOT_OFFSET_MAX_SHIFT)

    queue({
      x: clamp01(state.startOffsetX + dx / (2 * maxShiftX)),
      y: clamp01(state.startOffsetY + dy / (2 * maxShiftY))
    })
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.altKey || event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    moved.current = false
    const current = useLayoutStore.getState().slotOffset[slotId] ?? DEFAULT_SLOT_OFFSET
    drag.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startOffsetX: current.x,
      startOffsetY: current.y
    }
    setActive(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    event.preventDefault()
    applyFromPointer(event)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
    if (pending.current) {
      setOffsetForSlots([slotId], [slotId], pending.current)
      pending.current = null
    }
    drag.current = null
    setActive(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onClickCapture = (event: React.MouseEvent) => {
    if (!moved.current) return
    event.preventDefault()
    event.stopPropagation()
    moved.current = false
  }

  return {
    altDragging: active,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onClickCapture
  }
}

export default useSlotAltDrag
