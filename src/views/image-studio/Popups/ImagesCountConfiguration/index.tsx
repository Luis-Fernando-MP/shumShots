'use client'

import Dropzone, { type DropzoneFile } from '@/shared/components/Dropzone'
import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import Input from '@common/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/ui/Select'
import { toaster } from '@common/ui/Toast'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useLibraryImageSrc from '@views/image-studio/hooks/useLibraryImageSrc'
import useImageLibraryStore, {
  MAX_LIBRARY_IMAGES,
  type LibraryImage
} from '@views/image-studio/store/images/imageLibrary.store'
import usePicturesStore, { type PictureItem } from '@views/image-studio/store/images/pictures.store'
import useShadowStore from '@views/image-studio/Popups/ShadowConfiguration/store'
import { formatBytes, importStudioImage } from '@views/image-studio/utils/imageLibrary'
import { getPictureLayout } from '@views/image-studio/utils/pictureLayouts'
import { GripVerticalIcon, ImagePlusIcon, LayoutGridIcon, Trash2Icon, UploadIcon } from 'lucide-react'
import { type CSSProperties, type FC, useEffect, useRef, useState } from 'react'

import SectionBlock from '../BackgroundConfiguration/wrappers/SectionBlock'

const COUNTS = [1, 2, 3, 4, 5] as const
const EMPTY_VALUE = '__empty__'

const LayoutPreview: FC<{ count: number }> = ({ count }) => {
  const layout = getPictureLayout(count)
  return (
    <div className='bg-muted relative h-12 w-full overflow-hidden rounded-radius'>
      {layout.map((rect, index) => (
        <div
          key={index}
          className='bg-primary/35 border-primary/50 absolute rounded-sm border'
          style={{
            left: `${rect.x}%`,
            top: `${rect.y}%`,
            width: `${rect.w}%`,
            height: `${rect.h}%`
          }}
        />
      ))}
    </div>
  )
}

const importFiles = async (files: DropzoneFile[] | File[]) => {
  const created: string[] = []
  for (const file of files) {
    try {
      created.push((await importStudioImage(file)).id)
    } catch (error) {
      console.error(error)
      toaster({ title: `No se pudo importar ${file.name}`, type: 'error' })
    }
  }
  return created
}

const SortableSlotCard: FC<{
  picture: PictureItem
  selected: boolean
  onSelect: () => void
  onAssign: (libraryId: string | null) => void
  onUpload: (files: DropzoneFile[]) => void
}> = ({ picture, selected, onSelect, onAssign, onUpload }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: picture.id
  })
  const images = useImageLibraryStore(s => s.images)
  const image = picture.libraryId ? images.find(item => item.id === picture.libraryId) : undefined
  const src = useLibraryImageSrc(image?.active ? image.id : null)
  const fileRef = useRef<HTMLInputElement>(null)

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 20 : undefined
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-border/60 bg-card/40 flex flex-col gap-2 rounded-radius border p-2 transition-colors',
        selected && 'border-primary ring-primary/35 bg-secondary/20 ring-1',
        isDragging && 'shadow-lg'
      )}
    >
      <div className='flex items-center justify-between gap-2'>
        <Typography.Small className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
          {picture.id}
        </Typography.Small>
        <button
          type='button'
          className='text-muted-foreground hover:text-foreground touch-none rounded-sm p-0.5'
          aria-label='Reordenar slot'
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className='size-3.5' />
        </button>
      </div>

      <button
        type='button'
        onClick={onSelect}
        className='bg-muted/40 relative aspect-[4/3] w-full overflow-hidden rounded-radius'
      >
        {src ? (
          <img src={src} alt={image?.name ?? ''} className='size-full object-cover' />
        ) : (
          <span className='text-muted-foreground flex size-full flex-col items-center justify-center gap-1 text-xs'>
            <ImagePlusIcon className='size-4 opacity-70' />
            Vacío
          </span>
        )}
      </button>

      <Select
        value={picture.libraryId ?? EMPTY_VALUE}
        onValueChange={value => onAssign(value === EMPTY_VALUE ? null : value)}
      >
        <SelectTrigger aria-label={`Imagen de ${picture.id}`} className='h-8 px-2 text-xs'>
          <SelectValue placeholder='Asignar imagen' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EMPTY_VALUE}>Sin imagen</SelectItem>
          {images.map(item =>
            item.active ? (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ) : null
          )}
        </SelectContent>
      </Select>

      <Button
        type='button'
        size='sm'
        variant='outline'
        className='h-8 w-full gap-1.5 text-xs'
        onClick={() => fileRef.current?.click()}
      >
        <UploadIcon className='size-3.5' />
        {image ? 'Cambiar' : 'Subir'}
      </Button>
      <input
        ref={fileRef}
        type='file'
        accept='image/png,image/jpeg,image/webp'
        className='hidden'
        onChange={event => {
          const file = event.target.files?.[0]
          if (!file) return
          onUpload([file as DropzoneFile])
          event.target.value = ''
        }}
      />
    </div>
  )
}

const SortableLibraryRow: FC<{ image: LibraryImage }> = ({ image }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id
  })
  const renameImage = useImageLibraryStore(s => s.renameImage)
  const setActive = useImageLibraryStore(s => s.setActive)
  const removeImage = useImageLibraryStore(s => s.removeImage)
  const clearLibraryRefs = usePicturesStore(s => s.clearLibraryRefs)
  const src = useLibraryImageSrc(image.id)
  const [name, setName] = useState(image.name)

  useEffect(() => {
    setName(image.name)
  }, [image.name])

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 20 : undefined
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-muted/30 border-border/50 flex items-center gap-2 rounded-radius border px-2 py-1.5',
        isDragging && 'bg-card shadow-md'
      )}
    >
      <button
        type='button'
        className='text-muted-foreground hover:text-foreground touch-none shrink-0 rounded-sm p-0.5'
        aria-label='Reordenar imagen'
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className='size-4' />
      </button>
      {src ? (
        <img src={src} alt='' className='size-10 shrink-0 rounded-lg object-cover' />
      ) : (
        <div className='bg-muted size-10 shrink-0 rounded-lg' />
      )}
      <div className='min-w-0 flex-1'>
        <p className='text-foreground truncate text-xs font-medium tabular-nums'>
          {image.width} × {image.height} | {formatBytes(image.bytes)}
        </p>
        <Input
          value={name}
          onChange={event => setName(event.target.value)}
          onBlur={() => {
            if (name.trim() && name !== image.name) renameImage(image.id, name)
            else setName(image.name)
          }}
          variant='ghost'
          size='sm'
          className='h-6 px-0 text-xs'
          aria-label='Nombre único'
        />
      </div>
      <button
        type='button'
        onClick={() => setActive(image.id, !image.active)}
        className={cn(
          'flex shrink-0 items-center gap-1 text-xs font-medium',
          image.active ? 'text-semantic-success' : 'text-muted-foreground'
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full',
            image.active ? 'bg-semantic-success' : 'bg-muted-foreground/50'
          )}
        />
        {image.active ? 'Activo' : 'Inactivo'}
      </button>
      <button
        type='button'
        aria-label='Eliminar'
        className='text-muted-foreground hover:text-foreground'
        onClick={() => {
          clearLibraryRefs(image.id)
          removeImage(image.id)
        }}
      >
        <Trash2Icon className='size-3.5' />
      </button>
    </div>
  )
}

const ImagesCountConfiguration: FC = () => {
  const count = usePicturesStore(s => s.count)
  const pictures = usePicturesStore(s => s.pictures)
  const selectedId = usePicturesStore(s => s.selectedId)
  const setCount = usePicturesStore(s => s.setCount)
  const setSelected = usePicturesStore(s => s.setSelected)
  const setLibraryId = usePicturesStore(s => s.setLibraryId)
  const setPictureSize = usePicturesStore(s => s.setPictureSize)
  const reorderSlots = usePicturesStore(s => s.reorderSlots)
  const images = useImageLibraryStore(s => s.images)
  const reorderImages = useImageLibraryStore(s => s.reorderImages)
  const purgeSlotTargets = useShadowStore(s => s.purgeSlotTargets)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const assignUploaded = async (slotId: string, files: DropzoneFile[]) => {
    const ids = await importFiles(files)
    const id = ids[0]
    if (!id) return
    const entry = useImageLibraryStore.getState().getById(id)
    if (!entry) return
    setLibraryId(slotId, entry.id)
    setPictureSize(slotId, {
      width: entry.width,
      height: entry.height,
      aspectRatio: entry.width / Math.max(1, entry.height)
    })
    setSelected(slotId)
  }

  const handleSlotDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderSlots(String(active.id), String(over.id))
  }

  const handleLibraryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderImages(String(active.id), String(over.id))
  }

  return (
    <Popup className='h-[min(780px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Cantidad de imágenes'>
          <LayoutGridIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imágenes · Layout
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs'>
        <SectionBlock title='Cantidad' description='Elige de 1 a 5 slots en el canvas.'>
          <div className='grid grid-cols-5 gap-1.5'>
            {COUNTS.map(value => {
              const active = count === value
              return (
                <button
                  key={value}
                  type='button'
                  onClick={() => {
                    const removed = setCount(value)
                    if (removed.length > 0) purgeSlotTargets(removed)
                  }}
                  className={cn(
                    'flex flex-col gap-1 rounded-radius p-1 transition-colors',
                    active ? 'bg-secondary ring-primary/40 ring-1' : 'hover:bg-muted/50'
                  )}
                >
                  <LayoutPreview count={value} />
                  <span className='text-muted-foreground text-center text-xs font-medium'>
                    {value}
                  </span>
                </button>
              )
            })}
          </div>
        </SectionBlock>

        <SectionBlock
          title='Imágenes por cuadrícula'
          description='Arrastra el asa para reordenar. Asigna por nombre o sube una nueva.'
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSlotDragEnd}>
            <SortableContext items={pictures.map(item => item.id)} strategy={rectSortingStrategy}>
              <div className='grid grid-cols-2 gap-2.5'>
                {pictures.map(picture => (
                  <SortableSlotCard
                    key={picture.id}
                    picture={picture}
                    selected={picture.id === selectedId}
                    onSelect={() => setSelected(picture.id)}
                    onAssign={libraryId => {
                      setLibraryId(picture.id, libraryId)
                      if (!libraryId) return
                      const entry = useImageLibraryStore.getState().getById(libraryId)
                      if (!entry) return
                      setPictureSize(picture.id, {
                        width: entry.width,
                        height: entry.height,
                        aspectRatio: entry.width / Math.max(1, entry.height)
                      })
                    }}
                    onUpload={files => void assignUploaded(picture.id, files)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </SectionBlock>

        <SectionBlock
          title='Imágenes cargadas'
          description={`Hasta ${MAX_LIBRARY_IMAGES}. Metadata en local · blobs en IndexedDB.`}
        >
          <div className='mb-2'>
            <Dropzone
              maxFiles={MAX_LIBRARY_IMAGES}
              onDrop={files => {
                void importFiles(files)
              }}
            />
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleLibraryDragEnd}
          >
            <SortableContext items={images.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className='flex flex-col gap-1.5'>
                {images.length === 0 && (
                  <Typography.Small tone='secondary'>
                    Aún no hay imágenes en la biblioteca.
                  </Typography.Small>
                )}
                {images.map(image => (
                  <SortableLibraryRow key={image.id} image={image} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </SectionBlock>
      </Popup.Content>
    </Popup>
  )
}

export default ImagesCountConfiguration
