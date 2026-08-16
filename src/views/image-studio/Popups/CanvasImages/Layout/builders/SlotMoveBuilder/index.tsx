'use client'

import { cn } from '@common/utils/cn'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { getPositionEntry } from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/data'
import useLayoutStore, {
  DEFAULT_SLOT_OFFSET
} from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import { applySlotOffset } from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/slotOffset'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import useSizeStore, {
  resolveSlotSizeFromState
} from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import {
  type FC,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

const PAD_MARGIN = 0.06

const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))

const fitFrameInSlot = (
  slot: { left: number; top: number; width: number; height: number },
  aspect: number
) => {
  const slotAspect = slot.width / Math.max(1, slot.height)
  let width = slot.width
  let height = slot.height

  if (slotAspect > aspect) {
    height = slot.height
    width = slot.height * aspect
  } else {
    width = slot.width
    height = slot.width / aspect
  }

  return {
    left: slot.left + (slot.width - width) / 2,
    top: slot.top + (slot.height - height) / 2,
    width,
    height
  }
}

type Props = {
  targetIds: string[]
}

const SlotMoveBuilder: FC<Props> = ({ targetIds }) => {
  const pictures = usePicturesStore(s => s.pictures)
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const sizeLayers = useSizeStore(s => s.layers)
  const constrainToParent = useLayoutStore(s => s.constrainToParent)
  const positionId = useLayoutStore(s => s.positionId)
  const slotOffset = useLayoutStore(s => s.slotOffset)
  const setOffsetForSlots = useLayoutStore(s => s.setOffsetForSlots)

  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pending = useRef<{ x: number; y: number } | null>(null)
  const rafId = useRef(0)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)

  const allSlotIds = useMemo(() => pictures.map(p => p.id), [pictures])
  const focusSlotId = targetIds.length > 0 ? targetIds[0] : allSlotIds[0]
  const storeOffset = focusSlotId
    ? (slotOffset[focusSlotId] ?? DEFAULT_SLOT_OFFSET)
    : DEFAULT_SLOT_OFFSET
  const ball = dragOffset ?? storeOffset

  const placements = useMemo(() => {
    const slotSizes = pictures.map(picture => resolveSlotSizeFromState(sizeLayers, picture.id))
    const entry = getPositionEntry(pictures.length, positionId)
    return entry.builder({
      count: pictures.length,
      canvasWidth: backgroundWidth,
      canvasHeight: backgroundHeight,
      slotSizes,
      constrainToParent
    })
  }, [
    backgroundHeight,
    backgroundWidth,
    constrainToParent,
    pictures,
    positionId,
    sizeLayers
  ])

  const previewBoxes = useMemo(() => {
    return pictures.map((picture, index) => {
      const placement = placements[index]
      if (!placement) return null

      const offset =
        dragOffset && (targetIds.length === 0 || targetIds.includes(picture.id))
          ? dragOffset
          : (slotOffset[picture.id] ?? DEFAULT_SLOT_OFFSET)
      const visual = applySlotOffset(placement, offset, {
        width: backgroundWidth,
        height: backgroundHeight
      })

      const slotBox = {
        left: visual.x,
        top: visual.y,
        width: visual.width,
        height: visual.height
      }

      const frameAspect =
        picture.frameId && picture.frameAspect && picture.frameAspect > 0
          ? picture.frameAspect
          : null
      const box = frameAspect ? fitFrameInSlot(slotBox, frameAspect) : slotBox

      return {
        id: picture.id,
        box,
        rotateZ: placement.rotateZ,
        rotateX: placement.rotateX,
        rotateY: placement.rotateY,
        zIndex: placement.zIndex,
        hasFrame: Boolean(frameAspect),
        targeted: targetIds.length === 0 || targetIds.includes(picture.id)
      }
    })
  }, [
    backgroundHeight,
    backgroundWidth,
    dragOffset,
    pictures,
    placements,
    slotOffset,
    targetIds
  ])

  const flush = () => {
    rafId.current = 0
    const next = pending.current
    if (!next) return
    setOffsetForSlots(targetIds, allSlotIds, next)
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

  const moveBall = (event: ReactPointerEvent) => {
    const pad = padRef.current
    if (!pad) return
    const rect = pad.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const next = {
      x: clamp01((event.clientX - rect.left) / rect.width, PAD_MARGIN),
      y: clamp01((event.clientY - rect.top) / rect.height, PAD_MARGIN)
    }
    setDragOffset(next)
    queue(next)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
    if (pending.current) {
      setOffsetForSlots(targetIds, allSlotIds, pending.current)
      pending.current = null
    }
    setDragOffset(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const canvasW = Math.max(1, backgroundWidth)
  const canvasH = Math.max(1, backgroundHeight)

  return (
    <SectionBlock
      title='Mover en el canvas'
      description='Arrastra la bola aquí, o Alt+arrastrar cada imagen en el canvas.'
    >
      <div
        ref={padRef}
        className={cn(
          'bg-muted/40 ring-border/50 relative mx-auto w-full touch-none overflow-hidden rounded-[12px] ring-1 ring-inset',
          'cursor-crosshair'
        )}
        style={{ aspectRatio: `${canvasW} / ${canvasH}` }}
        onPointerDown={event => {
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          moveBall(event)
        }}
        onPointerMove={event => {
          if (!dragging.current) return
          moveBall(event)
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className='bg-background/80 pointer-events-none absolute inset-[8%] overflow-hidden rounded-md ring-1 ring-border/30'>
          {previewBoxes.map(item => {
            if (!item) return null
            const { box } = item
            const has3d = item.rotateX !== 0 || item.rotateY !== 0
            return (
              <div
                key={item.id}
                className={cn(
                  'absolute border',
                  item.hasFrame ? 'rounded-[5px]' : 'rounded-[3px]',
                  item.targeted
                    ? 'border-primary/70 bg-primary/35'
                    : 'border-foreground/20 bg-foreground/15'
                )}
                style={{
                  left: `${(box.left / canvasW) * 100}%`,
                  top: `${(box.top / canvasH) * 100}%`,
                  width: `${(box.width / canvasW) * 100}%`,
                  height: `${(box.height / canvasH) * 100}%`,
                  transform: has3d
                    ? `perspective(280px) rotateX(${item.rotateX}deg) rotateY(${item.rotateY}deg) rotate(${item.rotateZ}deg)`
                    : `rotate(${item.rotateZ}deg)`,
                  transformOrigin: 'center center',
                  zIndex: item.zIndex
                }}
              />
            )
          })}
        </div>

        <div
          className='bg-card border-primary pointer-events-none absolute z-20 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md'
          style={{ left: `${ball.x * 100}%`, top: `${ball.y * 100}%` }}
        />
      </div>
    </SectionBlock>
  )
}

export default SlotMoveBuilder
