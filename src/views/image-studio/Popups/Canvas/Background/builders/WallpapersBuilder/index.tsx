'use client'

import { wallpapersQuery, type Wallpaper } from '@common/core'
import SliceContainer from '@common/components/SliceContainer'
import Text from '@common/components/Text'
import { chromeFrame } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { Image } from '@unpic/react/nextjs'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const PREVIEW_WIDTH = 120
const PREVIEW_HEIGHT = 72
const THUMB_H = 56
const GAP = 8
const COLLAPSED_ROWS = 2
const COLLAPSED_MAX = THUMB_H * COLLAPSED_ROWS + GAP * (COLLAPSED_ROWS - 1)

/**
 * Miniatura de wallpaper para la cuadrícula de selección.
 * 
 * @param props - Propiedades de la miniatura.
 * @returns El botón con la previsualización del wallpaper.
 */
const WallpaperThumb: FC<{ item: Wallpaper; isActive: boolean; onSelect: (path: string) => void }> = ({
  item,
  isActive,
  onSelect
}) => {
  return (
    <button
      type='button'
      className={cn(
        'box-border h-14 w-full overflow-hidden text-left',
        chromeFrame(isActive)
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

/**
 * Constructor de sección para elegir fondos precargados (wallpapers).
 * 
 * Obtiene la lista de wallpapers desde la API y permite seleccionarlos
 * para el fondo del lienzo.
 * 
 * @returns La sección de wallpapers.
 */
const WallpapersBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const setBackground = useBackgroundStore(s => s.setBackground)
  const { data, isLoading, isError } = wallpapersQuery.list()
  const wallpapers = data?.data ?? []

  return (
    <SectionBlock
      title='Fondos precargados'
      description='Elige un wallpaper listo para usar como fondo del shot.'
    >
      {isLoading && <Text.caption>Cargando fondos…</Text.caption>}
      {isError && <Text.caption>No se pudieron cargar los fondos</Text.caption>}
      {!isLoading && !isError && wallpapers.length === 0 && (
        <Text.caption>No hay fondos precargados</Text.caption>
      )}
      {wallpapers.length > 0 && (
        <SliceContainer maxHeight={COLLAPSED_MAX} className='grid grid-cols-3 gap-2'>
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
    </SectionBlock>
  )
}

export default WallpapersBuilder
