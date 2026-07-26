'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/ui/Select'
import Typography from '@common/ui/Typography'
import useImageLibraryStore from '@views/image-studio/store/images/imageLibrary.store'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import { XIcon } from 'lucide-react'
import { type FC } from 'react'

const ALL_VALUE = '__all__'

type Props = {
  targetIds: string[]
  onChange: (ids: string[]) => void
}

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

const slotLabel = (slotId: string, imageName: string | null) =>
  imageName ? `${slotId} · ${imageName}` : `${slotId} · vacío`

const TargetSlotsPicker: FC<Props> = ({ targetIds, onChange }) => {
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
          <Chip label='Todos los slots' />
        ) : (
          targetIds.map(id => {
            const picture = pictures.find(item => item.id === id)
            if (!picture) return null
            return (
              <Chip
                key={id}
                label={slotLabel(picture.id, resolveName(picture.libraryId))}
                onRemove={() => onChange(targetIds.filter(item => item !== id))}
              />
            )
          })
        )}
      </div>

      {pictures.length === 0 && (
        <Typography.Small tone='secondary' className='text-xs'>
          Añade slots en Layout para asignar sombras y luces.
        </Typography.Small>
      )}
    </div>
  )
}

export default TargetSlotsPicker
