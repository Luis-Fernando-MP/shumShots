import { JSX, memo } from 'react'
import type { DebouncedState } from 'usehooks-ts'

import UnsplashImage from './UnsplashImage'
import { Photos } from './unsplash.type'

interface IUnsplashImages {
  images: Photos['results']
  setQuery: DebouncedState<(value: string) => void>
}

const recommendations = {
  Abstractos: 'Abstract',
  Geométricos: 'Geometric',
  Minimalistico: 'Minimalistic',
  Naturaleza: 'Nature',
  'Paisajes urbanos': 'Urban landscapes',
  Retratos: 'Portraits',
  Macro: 'Macro',
  'Arte conceptual': 'Conceptual art',
  Vintage: 'Vintage',
  'Matte oscuro': 'Dark matte'
}

const UnsplashImages = ({ images, setQuery }: IUnsplashImages): JSX.Element => {
  const RecommendedImages = () => {
    return (
      <section className='flex size-full flex-col gap-2 overflow-y-auto px-2 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <h4>Opciones Recomendadas</h4>
        <div className='flex flex-row flex-wrap items-center justify-center gap-2'>
          {Object.entries(recommendations).map(rec => {
            const [key, value] = rec
            return (
              <button key={key} className='rounded-[10px] border-2 border-dashed border-background px-3 py-2 text-sm font-medium text-foreground' onClick={() => setQuery(value)}>
                {key}
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  const ListOfImages = () => {
    return (
      <section className='size-full overflow-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <div>
          {images.map(image => {
            const key = image.id + Date.now()
            return <UnsplashImage key={key} image={image} />
          })}
        </div>
      </section>
    )
  }

  return images?.length >= 1 ? <ListOfImages /> : <RecommendedImages />
}

export default memo(UnsplashImages)
