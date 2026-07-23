import { newKey } from '@/shared/key'
import ShumShots from '@/shared/ui/ShumShots'
import { Image as ImageComponent } from '@unpic/react'
import React, { FC, MouseEvent, useEffect } from 'react'

import useImagesStore from '../../store/images/images.store'

interface Props {
  imageUrl?: string
  handleError: () => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  handleImageClick?: (e: MouseEvent) => void
}

const MAX_WIDTH = 624
const MAX_HEIGHT = 416

/**
 * PictureViewer component for displaying an image with loading state.
 *
 * @param {string} imageUrl - The URL of the image to be displayed.
 * @param {function} handleError - Function to handle errors when loading the image.
 * @param {boolean} isLoading - Indicates whether the image is currently loading.
 * @param {function} setIsLoading - Function to set the loading state.
 * @param {function} handleImageClick - Optional function to handle click events on the image.
 */
const PictureViewer: FC<Props> = ({ handleError, imageUrl, isLoading, setIsLoading, handleImageClick }) => {
  const { width, height, aspectRatio, setWidth, setHeight, setAspectRatio } = useImagesStore()

  useEffect(() => {
    if (!imageUrl) return
    const img = new Image()
    img.src = imageUrl

    const handleImageLoad = () => {
      const { naturalWidth, naturalHeight } = img
      const aspectRatio = naturalWidth / naturalHeight
      let newWidth = naturalWidth
      let newHeight = naturalHeight

      if (naturalWidth > MAX_WIDTH) {
        newWidth = MAX_WIDTH
        newHeight = newWidth / aspectRatio
      }

      if (newHeight > MAX_HEIGHT) {
        newHeight = MAX_HEIGHT
        newWidth = newHeight * aspectRatio
      }

      setWidth(Math.round(newWidth))
      setHeight(Math.round(newHeight))
      setAspectRatio(aspectRatio)
      setIsLoading(false)
    }

    img.onload = handleImageLoad
    img.onerror = handleError
  }, [imageUrl])

  return (
    <>
      {imageUrl && isLoading && (
        <div className='cvnPicture-loader grid place-content-center rounded-radius bg-background' style={{ width: `${width}px`, minHeight: `${height}px`, aspectRatio }}>
          <ShumShots size='lg' radius='none' transparent />
        </div>
      )}

      {imageUrl && !isLoading && (
        <div
          className='cvnPicture-container size-fit overflow-hidden box-content rounded-radius'
          id='picture-image'
          style={{ width: `${width}px`, minHeight: `${height}px`, aspectRatio }}
        >
          <ImageComponent
            key={newKey('main-image')}
            src={imageUrl}
            className='cvnPicture-image object-contain'
            alt='User uploaded image'
            layout='fixed'
            width={width}
            height={height}
            fetchPriority='high'
            cdn='cloudinary'
            onClick={handleImageClick}
            priority
            onError={handleError}
            operations={{
              cloudinary: {
                quality: 'auto:best',
                q: 100
              }
            }}
          />
        </div>
      )}
    </>
  )
}

export default PictureViewer
