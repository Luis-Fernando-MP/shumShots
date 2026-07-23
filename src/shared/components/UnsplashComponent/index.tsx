'use client'

import Unsplash from '@/shared/assets/Unsplash'
import { CircleEllipsisIcon, CircleXIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDebounceValue } from 'usehooks-ts'

import UnsplashImages from './UnsplashImages'
import UnsplashSearch from './UnsplashSearch'
import { Photos } from './unsplash.type'

type TStatus = 'loading' | 'error' | 'idle'
const UnsplashComponent = () => {
  const [view, setView] = useState(false)
  const [images, setImages] = useState<Photos['results']>([])
  const [query, setQuery] = useDebounceValue('', 500)

  const status = useRef<TStatus>('idle')
  const page = useRef(1)
  const totalPage = useRef(5)

  const fetchPhotos = useCallback(async () => {
    if (!query || status.current === 'loading') return
    status.current = 'loading'
    const URL = `/api/photos?query=${encodeURIComponent(query)}&per_page=10&page=${page.current}`

    try {
      const response = await fetch(URL)
      const data = await response.json()
      if (!data.results || data.results.length === 0) return toast.error('Sin resultados.')
      totalPage.current = data.total_pages
      page.current++
      setImages(prev => [...data.results, ...prev])
    } catch (error) {
      console.log('Error fetching photos:', error)
      toast.error('Error al buscar imágenes.')
      status.current = 'error'
    } finally {
      status.current = 'idle'
    }
  }, [query])

  useEffect(() => {
    page.current = 1
    totalPage.current = 5
    if (query) fetchPhotos()
  }, [query, fetchPhotos])

  const loadMore = useCallback(async () => {
    if (page.current >= totalPage.current) return toast.error('No hay más imágenes para cargar.')
    await fetchPhotos()
  }, [fetchPhotos])

  const handleClean = useCallback(() => {
    setImages([])
    page.current = 1
    totalPage.current = 5
  }, [])

  return (
    <article className='flex flex-col items-center gap-2'>
      <button className='flex w-full flex-row items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted bg-card p-2 [&>svg]:size-[25px]' onClick={() => setView(!view)}>
        <Unsplash />
        <h3>Unsplash</h3>
      </button>
      {view && (
        <section className='flex h-auto max-h-[450px] w-full flex-col items-center gap-2 rounded-lg bg-muted py-2 transition-all duration-500'>
          <UnsplashSearch setQuery={setQuery} query={query} />
          <UnsplashImages images={images} setQuery={setQuery} />
          {images.length > 0 && (
            <div className='flex w-full flex-row justify-center gap-2'>
              <button onClick={handleClean} className='flex flex-row items-center gap-1 rounded-md bg-background px-3 py-2'>
                <CircleXIcon /> Limpiar
              </button>
              {page.current <= totalPage.current && (
                <button onClick={loadMore} className='flex flex-row items-center gap-1 rounded-md bg-background px-3 py-2' disabled={status.current === 'loading'}>
                  <CircleEllipsisIcon /> {status.current === 'loading' ? 'Cargando...' : 'Más...'}
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </article>
  )
}

export default UnsplashComponent
