'use client'

import Chip from '@common/components/Chip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/components/Select'
import Typography from '@common/components/Typography'
import useImageLibraryStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/imageLibrary'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { type FC, useMemo } from 'react'

const ALL_VALUE = '__all__'

type Props = {
  targetIds: string[]
  onChange: (ids: string[]) => void
  emptyHint?: string
  exclusive?: boolean
  claimedIds?: string[]
  allowAll?: boolean
  lockLastChip?: boolean
}

const slotLabel = (slotId: string, imageName: string | null) =>
  imageName ? `${slotId} · ${imageName}` : `${slotId} · vacío`

const TargetSlotsPicker: FC<Props> = ({
  targetIds,
  onChange,
  emptyHint = 'Añade slots en Cuadrícula para asignar destinos.',
  exclusive = false,
  claimedIds = [],
  allowAll = true,
  lockLastChip = false
}) => {
  const pictures = usePicturesStore(s => s.pictures)
  const images = useImageLibraryStore(s => s.images)
  const allSelected = targetIds.length === 0
  const claimed = useMemo(() => new Set(claimedIds), [claimedIds])

  const options = useMemo(
    () =>
      pictures.filter(
        picture => !claimed.has(picture.id) && (allSelected || !targetIds.includes(picture.id))
      ),
    [allSelected, claimed, pictures, targetIds]
  )

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
    if (!targetIds.includes(value) && !claimed.has(value)) onChange([...targetIds, value])
  }

  const showAll = !exclusive || allowAll

  return (
    <div className='flex flex-col gap-2'>
      <Select value={allSelected && showAll ? ALL_VALUE : undefined} onValueChange={handleSelect}>
        <SelectTrigger className='h-8 w-full px-2.5 text-xs'>
          <SelectValue placeholder='Agregar slot…' />
        </SelectTrigger>
        <SelectContent>
          {showAll && (
            <SelectItem value={ALL_VALUE} className='text-xs'>
              Todos los slots
            </SelectItem>
          )}
          {options.map(picture => (
            <SelectItem key={picture.id} value={picture.id} className='text-xs'>
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
            const canRemove = !lockLastChip || targetIds.length > 1
            return (
              <Chip
                key={id}
                onRemove={canRemove ? () => onChange(targetIds.filter(item => item !== id)) : undefined}
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
