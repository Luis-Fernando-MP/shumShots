'use client'

import Chip from '@common/ui/Chip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/ui/Select'
import Typography from '@common/ui/Typography'
import useImageLibraryStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/imageLibrary'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { type FC } from 'react'

const ALL_VALUE = '__all__'

type Props = {
  targetIds: string[]
  onChange: (ids: string[]) => void
  emptyHint?: string
}

const slotLabel = (slotId: string, imageName: string | null) =>
  imageName ? `${slotId} · ${imageName}` : `${slotId} · vacío`

const TargetSlotsPicker: FC<Props> = ({
  targetIds,
  onChange,
  emptyHint = 'Añade slots en Cuadrícula para asignar destinos.'
}) => {
  const pictures = usePicturesStore(s => s.pictures)
  const images = useImageLibraryStore(s => s.images)
  const allSelected = targetIds.length === 0

  const resolveName = (libraryId: string | null) => {
    if (!libraryId) return null
    return images.find(item => item.id === libraryId)?.name ?? null
  }

  const handleSelect = (value: string) => {
    if (value === ALL_VALUE) {
      onChange([])
      return
    }
    if (allSelected) {
      onChange([value])
      return
    }
    if (!targetIds.includes(value)) onChange([...targetIds, value])
  }

  return (
    <div className='flex flex-col gap-2'>
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
              disabled={!allSelected && targetIds.includes(picture.id)}
            >
              {slotLabel(picture.id, resolveName(picture.libraryId))}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex min-h-7 flex-wrap gap-1.5'>
        {allSelected ? (
          <Chip>Todos los slots</Chip>
        ) : (
          targetIds.map(id => {
            const picture = pictures.find(item => item.id === id)
            if (!picture) return null
            return (
              <Chip
                key={id}
                onRemove={() => onChange(targetIds.filter(item => item !== id))}
                removeLabel={`Quitar ${id}`}
              >
                {slotLabel(id, resolveName(picture.libraryId))}
              </Chip>
            )
          })
        )}
      </div>

      {pictures.length === 0 && (
        <Typography.Small tone='secondary' className='text-xs'>
          {emptyHint}
        </Typography.Small>
      )}
    </div>
  )
}

export default TargetSlotsPicker
