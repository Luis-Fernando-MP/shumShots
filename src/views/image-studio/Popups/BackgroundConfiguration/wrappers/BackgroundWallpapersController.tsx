'use client'

import { wallpapersQuery, type Wallpaper } from '@common/core'
import SliceContainer from '@common/ui/SliceContainer'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { Image } from '@unpic/react/nextjs'
import type { FC } from 'react'

const PREVIEW_WIDTH = 160
const PREVIEW_HEIGHT = 90
const ROW_HEIGHT = 80

const WallpaperThumb: FC<{ item: Wallpaper; isActive: boolean; onSelect: (path: string) => void }> = ({
  item,
  isActive,
  onSelect
}) => {
  return (
    <button
      type='button'
      className={cn(
        'border-border box-border h-20 overflow-hidden rounded-radius border text-left transition-opacity hover:opacity-90',
        isActive && 'ring-primary ring-2 ring-offset-1'
      )}
      onClick={() => onSelect(item.path)}
      aria-label={`Fondo ${item.name}`}
    >
      <Image
        src={item.path}
        alt={item.name}
        layout='constrained'
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
        className='size-full object-cover'
        loading='lazy'
        decoding='async'
        fetchPriority='low'
        operations={{
          nextjs: {
            quality: 35
          }
        }}
      />
    </button>
  )
}

const BackgroundWallpapersController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)
  const { data, isLoading, isError } = wallpapersQuery.list()
  const wallpapers = data?.data ?? []

  return (
    <Typography.Block title='Fondos precargados' className='gap-grid flex flex-col'>
      {isLoading && <Typography.Small tone='secondary'>Cargando fondos…</Typography.Small>}
      {isError && <Typography.Small tone='secondary'>No se pudieron cargar los fondos</Typography.Small>}
      {!isLoading && !isError && wallpapers.length === 0 && (
        <Typography.Small tone='secondary'>No hay wallpapers en /public/wallpapers</Typography.Small>
      )}
      {wallpapers.length > 0 && (
        <SliceContainer maxHeight={ROW_HEIGHT} className='gap-grid grid grid-cols-2'>
          {wallpapers.map(item => (
            <WallpaperThumb
              key={item.id}
              item={item}
              isActive={background === item.path}
              onSelect={setBackground}
            />
          ))}
        </SliceContainer>
      )}
    </Typography.Block>
  )
}

export default BackgroundWallpapersController
