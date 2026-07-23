import useBackgroundImage, { styleSetBackground } from '@/app/(pages)/editor/store/backgroundImage.store'
import { type JSX, memo } from 'react'

import { PhotosResult } from './unsplash.type'

interface IUnsplashImage {
  image: PhotosResult
}

const UnsplashImage = ({ image }: IUnsplashImage): JSX.Element => {
  const { setBackground } = useBackgroundImage()

  const handleClick = (): void => {
    const background = styleSetBackground(image.urls.full)
    setBackground(background)
  }

  return (
    <button className='animate-fade-in-up overflow-hidden p-1' onClick={handleClick}>
      <img className='max-h-[80px] max-w-[90px] rounded-lg object-contain' src={image.urls.thumb} alt={image.slug} />
    </button>
  )
}

export default memo(UnsplashImage)
