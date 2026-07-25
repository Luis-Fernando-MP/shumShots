'use client'

import type { DropzoneFile } from '@/shared/components/Dropzone'
import { toaster } from '@common/ui/Toast'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import { useCallback, useEffect, useRef, useState } from 'react'

const usePictureSlot = (pictureId: string) => {
  const picture = usePicturesStore(s => s.pictures.find(item => item.id === pictureId) ?? null)
  const setPictureUrl = usePicturesStore(s => s.setPictureUrl)
  const setPictureSize = usePicturesStore(s => s.setPictureSize)
  const setSelected = usePicturesStore(s => s.setSelected)

  const [isLoading, setIsLoading] = useState(false)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const handleLoadError = useCallback(() => {
    toaster({ title: 'Carga una nueva imagen', type: 'error', id: `load-error-${pictureId}` })
    setPictureUrl(pictureId, null)
    setIsLoading(false)
  }, [pictureId, setPictureUrl])

  const handleDropFile = useCallback(
    (files: DropzoneFile[]) => {
      const file = files[0]
      if (!file) return

      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
      const blobUrl = URL.createObjectURL(file)
      blobUrlRef.current = blobUrl

      setIsLoading(true)
      setSelected(pictureId)
      setPictureUrl(pictureId, blobUrl)
    },
    [pictureId, setPictureUrl, setSelected]
  )

  const handleSize = useCallback(
    (size: { width: number; height: number; aspectRatio: number }) => {
      setPictureSize(pictureId, size)
    },
    [pictureId, setPictureSize]
  )

  return {
    picture,
    isLoading,
    setIsLoading,
    handleLoadError,
    handleDropFile,
    handleSize,
    select: () => setSelected(pictureId)
  }
}

export default usePictureSlot
