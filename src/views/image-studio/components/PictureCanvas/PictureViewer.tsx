'use client'

import ShumShots from '@/shared/ui/ShumShots'
import { Image as ImageComponent } from '@unpic/react'
import { type FC, useEffect } from 'react'

import useImagesStore from '../../store/images/images.store'

interface Props {
  imageUrl?: string
  handleError: () => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const MAX_WIDTH = 624
const MAX_HEIGHT = 416

const PictureViewer: FC<Props> = ({ handleError, imageUrl, isLoading, setIsLoading }) => {
  const { width, height, aspectRatio, setWidth, setHeight, setAspectRatio } = useImagesStore()
  const isLocal = Boolean(imageUrl?.startsWith('blob:') || imageUrl?.startsWith('data:'))

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

      setWidth(Math.round(nextWidth))
      setHeight(Math.round(nextHeight))
      setAspectRatio(ratio)
      setIsLoading(false)
    }

    img.onload = handleImageLoad
    img.onerror = handleError

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl, handleError, setAspectRatio, setHeight, setIsLoading, setWidth])

  if (!imageUrl) return null

  if (isLoading) {
    return (
      <div
        className='cvnPicture-loader grid place-content-center rounded-radius bg-background'
        style={{ width, minHeight: height, aspectRatio }}
      >
        <ShumShots size='lg' radius='none' transparent />
      </div>
    )
  }

  const imageClassName = 'cvnPicture-image size-full object-contain'

  return (
    <div className='cvnPicture-container size-full overflow-hidden' style={{ width, minHeight: height, aspectRatio }}>
      {isLocal ? (
        <img
          src={imageUrl}
          className={imageClassName}
          alt='Imagen del shot'
          width={width}
          height={height}
          onError={handleError}
        />
      ) : (
        <ImageComponent
          src={imageUrl}
          className={imageClassName}
          alt='Imagen del shot'
          layout='fixed'
          width={width}
          height={height}
          fetchPriority='high'
          cdn='cloudinary'
          priority
          onError={handleError}
          operations={{
            cloudinary: {
              quality: 'auto:best',
              q: 100
            }
          }}
        />
      )}
    </div>
  )
}

export default PictureViewer
