'use client'

import { photosQuery, type Photo } from '@common/core'
import Input from '@common/components/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@common/components/Select'
import Text from '@common/components/Text'
import { chromeFrame } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import Popup from '@common/components/Popup'
import { Image } from '@unpic/react'
import { SearchIcon } from 'lucide-react'
import { type FC, type ReactElement, type ReactNode, useMemo, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

const CATEGORIES = [
  { label: 'Fondos profesionales', value: 'professional wallpaper background' },
  { label: 'Abstracto', value: 'abstract background' },
  { label: 'Naturaleza', value: 'nature landscape' },
  { label: 'Minimal', value: 'minimal background' },
  { label: 'Gradiente', value: 'gradient soft background' },
  { label: 'Oscuro', value: 'dark moody background' },
  { label: 'Workspace', value: 'desk workspace aesthetic' },
  { label: 'Textura', value: 'texture pattern background' },
  { label: 'Ciudad', value: 'city skyline night' },
  { label: 'Océano', value: 'ocean waves aerial' },
  { label: 'Montañas', value: 'mountain landscape sunrise' }
] as const

const PREVIEW_WIDTH = 160
const PREVIEW_HEIGHT = 100

type Props = {
  onSelect: (url: string, photo?: Photo) => void
  children?: ReactElement | ReactNode
  title?: string
  embedded?: boolean
}

const UnsplashPickerBody: FC<{ onSelect: Props['onSelect'] }> = ({ onSelect }) => {
  const [category, setCategory] = useState<string>(CATEGORIES[0].value)
  const [search, setSearch] = useDebounceValue('', 400)

  const query = useMemo(() => {
    const trimmed = search.trim()
    if (trimmed) return trimmed
    return category
  }, [category, search])

  const { data, isLoading, isError, isFetching } = photosQuery.search({
    query,
    perPage: 10,
    page: 1
  })

  const photos = data?.data.results ?? []

  return (
    <div className='gap-grid-lg flex flex-col'>
      <div className='gap-grid flex flex-col'>
        <Input
          variant='soft'
          prefix={<SearchIcon className='size-4' />}
          placeholder='Buscar en Unsplash…'
          defaultValue=''
          onChange={event => setSearch(event.target.value)}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label='Categoría' className='rounded-[12px]'>
            <SelectValue placeholder='Categoría' />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <Text.caption>Cargando imágenes…</Text.caption>}
      {isError && <Text.caption>No se pudieron cargar las imágenes</Text.caption>}
      {!isLoading && !isError && photos.length === 0 && (
        <Text.caption>Sin resultados para esta búsqueda</Text.caption>
      )}

      {photos.length > 0 && (
        <div className={cn('gap-grid grid grid-cols-2', isFetching && 'opacity-80')}>
          {photos.map(photo => (
            <button
              key={photo.id}
              type='button'
              className={cn('overflow-hidden text-left', chromeFrame())}
              onClick={() => onSelect(photo.urls.full, photo)}
              aria-label={photo.alt}
            >
              <Image
                src={photo.urls.raw}
                alt={photo.alt}
                layout='constrained'
                width={PREVIEW_WIDTH}
                height={PREVIEW_HEIGHT}
                cdn='imgix'
                loading='lazy'
                decoding='async'
                fetchPriority='low'
                operations={{
                  imgix: {
                    q: 35,
                    auto: 'format',
                    fit: 'crop'
                  }
                }}
                className='h-24 w-full object-cover transition-transform group-hover:scale-[1.02]'
              />
              <Text.caption className='truncate px-2 py-1.5'>{photo.photographer}</Text.caption>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Buscador de fotos Unsplash. En `embedded` se renderiza sin Popup.
 *
 * @param props.onSelect - Recibe la URL full y el foto opcional al elegir.
 * @param props.embedded - Si es true, muestra el grid inline (sidebar). Default false.
 * @param props.children - Trigger del Popup cuando no está embebido.
 */
const UnsplashPicker: FC<Props> = ({ onSelect, children, title = 'Unsplash', embedded = false }) => {
  if (embedded) {
    return <UnsplashPickerBody onSelect={onSelect} />
  }

  return (
    <Popup className='h-[640px] w-[380px]'>
      <Popup.Trigger>{children}</Popup.Trigger>
      <Popup.Header>{title}</Popup.Header>
      <Popup.Content>
        <UnsplashPickerBody onSelect={onSelect} />
      </Popup.Content>
    </Popup>
  )
}

export default UnsplashPicker
