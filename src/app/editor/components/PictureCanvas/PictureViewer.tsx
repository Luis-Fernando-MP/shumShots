import ShumShots from '@/shared/ui/ShumShots'
import { Image as ImageComponent } from '@unpic/react'
import React, { CSSProperties, FC, MouseEvent, memo, useEffect, useState } from 'react'

type ImageDimensions = {
  width: number
  height: number
  aspectRatio: number
}

interface Props {
  imageUrl: string | null
  transform: string
  handleError: () => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  handleImageClick?: (e: MouseEvent) => void
}

const MAX_WIDTH = 724
const MAX_HEIGHT = 516

const PictureViewer: FC<Props> = ({ handleError, imageUrl, isLoading, setIsLoading, handleImageClick, transform }) => {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null)

  console.log('render ImageViewer')

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

      setDimensions({
        width: newWidth,
        height: newHeight,
        aspectRatio
      })
      setIsLoading(false)
    }

    img.onload = handleImageLoad
    img.onerror = handleError
  }, [imageUrl, handleError, setIsLoading])

  if (!imageUrl || !dimensions) return null

  const { width, height, aspectRatio } = dimensions
  const style: CSSProperties = { width: `${width}px`, minHeight: `${height}px`, aspectRatio, transform }

  return (
    <>
      {isLoading && (
        <div className='cvnPicture cvnPicture-loader' style={style}>
          <ShumShots size='lg' radius='none' transparent />
        </div>
      )}

      {!isLoading && (
        <div className='cvnPicture cvnPicture-container' id='picture-image' style={style}>
          <ImageComponent
            src={imageUrl}
            className='cvnPicture-image'
            alt='User uploaded image'
            layout='fullWidth'
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

export default memo(PictureViewer)
