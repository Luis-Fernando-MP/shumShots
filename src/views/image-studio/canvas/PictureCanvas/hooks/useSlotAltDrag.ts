import useBoardStore from '@common/components/Board/board.store'
import useLayoutStore, {
  DEFAULT_SLOT_OFFSET
} from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import {
  applySlotOffset,
  visualPositionToOffset
} from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/slotOffset'
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from 'react'

const isSlotMoveModifier = (event: { altKey: boolean; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) =>
  event.altKey || event.shiftKey || event.ctrlKey || event.metaKey

type DragState = {
  pointerId: number
  startClientX: number
  startClientY: number
  startX: number
  startY: number
}

type Args = {
  slotId: string
  canvasWidth: number
  canvasHeight: number
  baseX: number
  baseY: number
  slotWidth: number
  slotHeight: number
}

/**
 * Alt/Ctrl/Shift + drag updates that slot's layout offset (shared with SlotMoveBuilder).
 * Travel is limited by the parent canvas, not by the active position preset.
 */
const useSlotAltDrag = ({
  slotId,
  canvasWidth,
  canvasHeight,
  baseX,
  baseY,
  slotWidth,
  slotHeight
}: Args) => {
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

    const placement = { x: baseX, y: baseY, width: slotWidth, height: slotHeight }
    const canvas = { width: canvasWidth, height: canvasHeight }
    queue(
      visualPositionToOffset(
        placement,
        { x: state.startX + dx, y: state.startY + dy },
        canvas
      )
    )
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isSlotMoveModifier(event) || event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    moved.current = false

    const offset = useLayoutStore.getState().slotOffset[slotId] ?? DEFAULT_SLOT_OFFSET
    const placement = { x: baseX, y: baseY, width: slotWidth, height: slotHeight }
    const canvas = { width: canvasWidth, height: canvasHeight }
    const visual = applySlotOffset(placement, offset, canvas)

    drag.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: visual.x,
      startY: visual.y
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setActive(true)
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
