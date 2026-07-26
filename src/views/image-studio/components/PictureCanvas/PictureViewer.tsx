'use client'

import ShumShots from '@/shared/ui/ShumShots'
import { createElement, type FC, useEffect, useRef } from 'react'

type Props = {
  imageUrl?: string | null
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  onError: () => void
  onSize: (size: { width: number; height: number; aspectRatio: number }) => void
}

const PictureViewer: FC<Props> = ({ imageUrl, isLoading, setIsLoading, onError, onSize }) => {
  const onErrorRef = useRef(onError)
  const onSizeRef = useRef(onSize)
  const setIsLoadingRef = useRef(setIsLoading)
  const lastSizeKey = useRef('')

  onErrorRef.current = onError
  onSizeRef.current = onSize
  setIsLoadingRef.current = setIsLoading

  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.src = imageUrl

    img.onload = () => {
      const { naturalWidth, naturalHeight } = img
      const aspectRatio = naturalWidth / Math.max(1, naturalHeight)
      const key = `${naturalWidth}x${naturalHeight}`
      if (lastSizeKey.current !== key) {
        lastSizeKey.current = key
        onSizeRef.current({ width: naturalWidth, height: naturalHeight, aspectRatio })
      }
      setIsLoadingRef.current(false)
    }
    img.onerror = () => onErrorRef.current()

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl])

  if (!imageUrl) return null

  if (isLoading) {
    return (
      <div className='absolute inset-0 grid size-full place-content-center bg-background/40'>
        <ShumShots size='lg' radius='none' transparent />
      </div>
    )
  }

  return createElement('img', {
    src: imageUrl,
    className: 'pointer-events-none absolute inset-0 size-full object-cover object-center',
    alt: 'Imagen del shot',
    onError
  })
}

export default PictureViewer
