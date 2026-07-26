'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/ui/Select'
import { cn } from '@common/utils/cn'
import useFrameStore, { defaultSlotPan } from '@views/image-studio/Popups/FrameConfiguration/store'
import useImageLibraryStore from '@views/image-studio/store/images/imageLibrary.store'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import { XIcon } from 'lucide-react'
import {
  type FC,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const ALL_VALUE = '__all__'
const PAD_MARGIN = 0.06

const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))

const Chip: FC<{ label: string; onRemove?: () => void }> = ({ label, onRemove }) => (
  <span className='border-border bg-muted/50 text-foreground inline-flex h-7 max-w-[11rem] items-center gap-1 rounded-md border px-2 text-xs font-medium'>
    <span className='truncate'>{label}</span>
    {onRemove && (
      <button
        type='button'
        aria-label={`Quitar ${label}`}
        className='text-muted-foreground hover:text-foreground shrink-0 rounded-sm p-0.5'
        onClick={onRemove}
      >
        <XIcon className='size-3' />
      </button>
    )}
  </span>
)

const SlotPanSection: FC = () => {
  const pictures = usePicturesStore(s => s.pictures)
  const images = useImageLibraryStore(s => s.images)
  const selectedSlotIds = useFrameStore(s => s.selectedSlotIds)
  const setSelectedSlotIds = useFrameStore(s => s.setSelectedSlotIds)
  const setPanForSelected = useFrameStore(s => s.setPanForSelected)
  const slotPan = useFrameStore(s => s.slotPan)

  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pendingPan = useRef<{ x: number; y: number } | null>(null)
  const rafId = useRef(0)
  const [dragPan, setDragPan] = useState<{ x: number; y: number } | null>(null)

  const allSelected = selectedSlotIds.length === 0
  const focusSlotId = allSelected ? pictures[0]?.id : selectedSlotIds[0]
  const storePan = focusSlotId ? (slotPan[focusSlotId] ?? defaultSlotPan) : defaultSlotPan
  const pan = dragPan ?? storePan

  const resolveName = (libraryId: string | null) => {
    if (!libraryId) return null
    return images.find(item => item.id === libraryId)?.name ?? null
  }

  const slotLabel = (slotId: string, imageName: string | null) =>
    imageName ? `${slotId} · ${imageName}` : `${slotId} · vacío`

  const handleSelect = (value: string) => {
    if (value === ALL_VALUE) {
      setSelectedSlotIds([])
      return
    }
    if (allSelected) {
      setSelectedSlotIds([value])
      return
    }
    if (!selectedSlotIds.includes(value)) setSelectedSlotIds([...selectedSlotIds, value])
  }

  const flushPan = () => {
    rafId.current = 0
    const next = pendingPan.current
    if (!next) return
    setPanForSelected(next)
  }

  const queuePan = (next: { x: number; y: number }) => {
    pendingPan.current = next
    if (!rafId.current) rafId.current = requestAnimationFrame(flushPan)
  }

  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    },
    []
  )

  const movePan = (event: ReactPointerEvent) => {
    const pad = padRef.current
    if (!pad) return
    const rect = pad.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const next = {
      x: clamp01((event.clientX - rect.left) / rect.width, PAD_MARGIN),
      y: clamp01((event.clientY - rect.top) / rect.height, PAD_MARGIN)
    }
    setDragPan(next)
    queuePan(next)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
    if (pendingPan.current) {
      setPanForSelected(pendingPan.current)
      pendingPan.current = null
    }
    setDragPan(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  useEffect(() => {
    if (pictures.length === 0) return
    const valid = new Set(pictures.map(item => item.id))
    const next = selectedSlotIds.filter(id => valid.has(id))
    if (next.length !== selectedSlotIds.length) setSelectedSlotIds(next)
  }, [pictures, selectedSlotIds, setSelectedSlotIds])

  const chips = useMemo(() => {
    if (allSelected) return <Chip label='Todos los slots' />
    return selectedSlotIds.map(id => {
      const picture = pictures.find(item => item.id === id)
      if (!picture) return null
      return (
        <Chip
          key={id}
          label={slotLabel(picture.id, resolveName(picture.libraryId))}
          onRemove={() => setSelectedSlotIds(selectedSlotIds.filter(item => item !== id))}
        />
      )
    })
  }, [allSelected, pictures, selectedSlotIds, images, setSelectedSlotIds])

  return (
    <SectionBlock
      title='Posición en el frame'
      description='Arrastra el recuadro para mover la imagen en los slots seleccionados.'
    >
      <div className='gap-grid flex items-start'>
        <div
          ref={padRef}
          className={cn(
            'bg-muted/30 relative aspect-square w-[120px] shrink-0 touch-none overflow-hidden rounded-md ring-1 ring-inset ring-border/40',
            'cursor-crosshair'
          )}
          onPointerDown={event => {
            dragging.current = true
            event.currentTarget.setPointerCapture(event.pointerId)
            movePan(event)
          }}
          onPointerMove={event => {
            if (!dragging.current) return
            movePan(event)
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className='border-primary bg-primary/25 pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-sm border'
            style={{ left: `${pan.x * 100}%`, top: `${pan.y * 100}%` }}
          />
        </div>

        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          <Select value={allSelected ? ALL_VALUE : undefined} onValueChange={handleSelect}>
            <SelectTrigger className='h-8 w-full px-2.5 text-xs'>
              <SelectValue placeholder='Agregar slot…' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE} className='text-xs'>
                Todos los slots
              </SelectItem>
              {pictures.map(picture => (
                <SelectItem
                  key={picture.id}
                  value={picture.id}
                  className='text-xs'
                  disabled={!allSelected && selectedSlotIds.includes(picture.id)}
                >
                  {slotLabel(picture.id, resolveName(picture.libraryId))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='flex min-h-7 flex-wrap gap-1.5'>{chips}</div>
        </div>
      </div>
    </SectionBlock>
  )
}

export default SlotPanSection
