'use client'

import ShumShots from '@/shared/ui/ShumShots'
import { type FC, useEffect } from 'react'

interface Props {
  imageUrl?: string | null
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  onError: () => void
  onSize: (size: { width: number; height: number; aspectRatio: number }) => void
}

const MAX_WIDTH = 624
const MAX_HEIGHT = 416

const PictureViewer: FC<Props> = ({ imageUrl, isLoading, setIsLoading, onError, onSize }) => {
  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.src = imageUrl

    const handleImageLoad = () => {
      const { naturalWidth, naturalHeight } = img
      const ratio = naturalWidth / naturalHeight
      let nextWidth = naturalWidth
      let nextHeight = naturalHeight

      if (naturalWidth > MAX_WIDTH) {
        nextWidth = MAX_WIDTH
        nextHeight = nextWidth / ratio
      }

      if (nextHeight > MAX_HEIGHT) {
        nextHeight = MAX_HEIGHT
        nextWidth = nextHeight * ratio
      }

      onSize({
        width: Math.round(nextWidth),
        height: Math.round(nextHeight),
        aspectRatio: ratio
      })
      setIsLoading(false)
    }

    img.onload = handleImageLoad
    img.onerror = onError

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl, onError, onSize, setIsLoading])

  if (!imageUrl) return null

  if (isLoading) {
    return (
      <div className='absolute inset-0 grid size-full place-content-center bg-background/40'>
        <ShumShots size='lg' radius='none' transparent />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      className='pointer-events-none absolute inset-0 size-full object-cover object-center'
      alt='Imagen del shot'
      onError={onError}
    />
  )
}

export default PictureViewer
