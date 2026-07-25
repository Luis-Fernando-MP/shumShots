import type { DropzoneFile } from '@/shared/components/Dropzone'
import { toaster } from '@common/ui/Toast'
import { HOST_URL } from '@/shared/constants'
import { useWorker } from '@koale/useworker'
import { useCallback, useEffect, useRef, useState } from 'react'

import useImagesStore from '../store/images/images.store'
import usePicturesStore from '../store/images/pictures.store'
import uploadImage from '../workers/upload.worker'

const usePictureCanvas = () => {
  const picture = usePicturesStore(s => s.picture)
  const setPicture = usePicturesStore(s => s.setPicture)
  const { width, height, aspectRatio } = useImagesStore()

  const [isLoading, setIsLoading] = useState(false)
  const blobUrlRef = useRef<string | null>(null)
  const [upload] = useWorker(uploadImage)

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const sendImage = useCallback(
    async (file: File, blobUrl: string) => {
      try {
        const result = await upload(file, `${HOST_URL}/api/upload`)
        if (result instanceof Error) throw result
        setPicture({ url: result.original_image })
        if (blobUrlRef.current === blobUrl) {
          URL.revokeObjectURL(blobUrl)
          blobUrlRef.current = null
        }
      } catch {
        toaster({ title: 'Error al subir la imagen', type: 'error', id: 'upload-error' })
        setPicture(null)
        if (blobUrlRef.current === blobUrl) {
          URL.revokeObjectURL(blobUrl)
          blobUrlRef.current = null
        }
        setIsLoading(false)
      }
    },
    [upload, setPicture]
  )

  const handleLoadError = useCallback(() => {
    toaster({ title: 'Carga una nueva imagen', type: 'error', id: 'load-error' })
    setPicture(null)
    setIsLoading(false)
  }, [setPicture])

  const handleDropFile = useCallback(
    (files: DropzoneFile[]) => {
      const file = files[0]
      if (!file) return

      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
      const blobUrl = URL.createObjectURL(file)
      blobUrlRef.current = blobUrl

      setIsLoading(true)
      setPicture({ url: blobUrl })
      void sendImage(file, blobUrl)
    },
    [sendImage, setPicture]
  )

  return {
    width,
    height,
    aspectRatio,
    currentPicture: picture,
    isLoading,
    setIsLoading,
    handleLoadError,
    handleDropFile
  }
}

export default usePictureCanvas
