'use client'

import { type DropzoneFile } from '@common/components/Dropzone'
import { Button } from '@common/components/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/components/Select'
import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
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
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useLibraryImageSrc from '@views/image-studio/Popups/CanvasImages/ImagesCount/hooks/useLibraryImageSrc'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useImageLibraryStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/imageLibrary'
import usePicturesStore, {
  type PictureItem
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { importStudioImage } from '@views/image-studio/utils/imageLibrary'
import { toaster } from '@common/components/Toast'
import { GripVerticalIcon, ImagePlusIcon, UploadIcon } from 'lucide-react'
import { type CSSProperties, type FC, useRef } from 'react'

const EMPTY_VALUE = '__empty__'

/**
 * Tarjeta de un slot individual para la lista de ordenamiento y asignación.
 * 
 * Permite seleccionar el slot, reordenarlo mediante drag-and-drop,
 * asignar una imagen de la biblioteca o subir una nueva.
 * 
 * @param props - Propiedades de la tarjeta de slot.
 * @returns La tarjeta interactiva del slot.
 */
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
        'flex flex-col gap-2 p-2',
        chromeTile(selected),
        isDragging && 'shadow-lg'
      )}
    >
      <div className='flex items-center justify-between gap-2'>
        <Text.emphasis>{picture.id}</Text.emphasis>
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
        className='bg-muted/50 relative aspect-[4/3] w-full overflow-hidden rounded-md'
      >
        {src && (
          <img src={src} alt={image?.name ?? ''} className='size-full object-cover' />
        )}
        {!src && (
          <span className='text-muted-foreground flex size-full flex-col items-center justify-center gap-1.5 text-xs'>
            <ImagePlusIcon className='size-4 opacity-70' />
            <Text.caption>Vacío</Text.caption>
          </span>
        )}
      </button>

      <Select
        value={picture.libraryId ?? EMPTY_VALUE}
        onValueChange={value => onAssign(value === EMPTY_VALUE ? null : value)}
      >
        <SelectTrigger aria-label={`Imagen de ${picture.id}`} className='h-8 px-2.5 text-xs'>
          <SelectValue placeholder='Asignar imagen' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EMPTY_VALUE}>Sin imagen</SelectItem>
          {images.map(item => (
            item.active && (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            )
          ))}
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
        {image && 'Cambiar'}
        {!image && 'Subir'}
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

/**
 * Constructor de sección para gestionar los slots de imagen.
 * 
 * Permite asignar imágenes a cada slot, reordenarlas mediante arrastre
 * y subir nuevos archivos.
 * 
 * @returns La sección de gestión de slots.
 */
const SlotsBuilder: FC = () => {
  const pictures = usePicturesStore(s => s.pictures)
  const selectedId = usePicturesStore(s => s.selectedId)
  const setSelected = usePicturesStore(s => s.setSelected)
  const setLibraryId = usePicturesStore(s => s.setLibraryId)
  const setPictureSize = usePicturesStore(s => s.setPictureSize)
  const reorderSlots = usePicturesStore(s => s.reorderSlots)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const assignUploaded = async (slotId: string, files: DropzoneFile[]) => {
    for (const file of files) {
      try {
        const entry = await importStudioImage(file)
        setLibraryId(slotId, entry.id)
        setPictureSize(slotId, {
          width: entry.width,
          height: entry.height,
          aspectRatio: entry.width / Math.max(1, entry.height)
        })
        setSelected(slotId)
        return
      } catch (error) {
        console.error(error)
        toaster({ title: `No se pudo importar ${file.name}`, type: 'error' })
      }
    }
  }

  const handleSlotDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderSlots(String(active.id), String(over.id))
  }

  return (
    <SectionBlock
      title='Asignación por slot'
      description='Arrastra el asa para reordenar. Asigna por nombre o sube una nueva.'
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSlotDragEnd}>
        <SortableContext items={pictures.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className='grid grid-cols-2 gap-3'>
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
  )
}

export default SlotsBuilder
