'use client'

import Dropzone, { type DropzoneFile } from '@/shared/components/Dropzone'
import Input from '@common/ui/Input'
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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useLibraryImageSrc from '@views/image-studio/Popups/CanvasImages/ImagesCount/hooks/useLibraryImageSrc'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useImageLibraryStore, {
  MAX_LIBRARY_IMAGES,
  type LibraryImage
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/imageLibrary'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { formatBytes, importStudioImage } from '@views/image-studio/utils/imageLibrary'
import { toaster } from '@common/ui/Toast'
import { GripVerticalIcon, Trash2Icon } from 'lucide-react'
import { type CSSProperties, type FC, useEffect, useState } from 'react'

const importFiles = async (files: DropzoneFile[] | File[]) => {
  for (const file of files) {
    try {
      await importStudioImage(file)
    } catch (error) {
      console.error(error)
      toaster({ title: `No se pudo importar ${file.name}`, type: 'error' })
    }
  }
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
        'bg-muted/25 border-border/60 flex items-center gap-2.5 rounded-lg border px-2.5 py-2',
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
        <img src={src} alt='' className='size-10 shrink-0 rounded-md object-cover' />
      ) : (
        <div className='bg-muted size-10 shrink-0 rounded-md' />
      )}
      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <p className='text-muted-foreground truncate text-[11px] tabular-nums'>
          {image.width} × {image.height} · {formatBytes(image.bytes)}
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
          'flex shrink-0 items-center gap-1.5 text-xs font-medium',
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
        className='text-muted-foreground hover:text-foreground shrink-0'
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

const LibraryBuilder: FC = () => {
  const images = useImageLibraryStore(s => s.images)
  const reorderImages = useImageLibraryStore(s => s.reorderImages)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleLibraryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderImages(String(active.id), String(over.id))
  }

  return (
    <SectionBlock
      title='Biblioteca'
      description={`Hasta ${MAX_LIBRARY_IMAGES} imágenes. Metadata en local · blobs en IndexedDB.`}
    >
      <div className='flex flex-col gap-3'>
        <Dropzone
          maxFiles={MAX_LIBRARY_IMAGES}
          onDrop={files => {
            void importFiles(files)
          }}
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLibraryDragEnd}>
          <SortableContext items={images.map(item => item.id)} strategy={verticalListSortingStrategy}>
            <div className='flex flex-col gap-2'>
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
      </div>
    </SectionBlock>
  )
}

export default LibraryBuilder
