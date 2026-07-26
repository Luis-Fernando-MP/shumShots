'use client'

import useImageLibraryStore from '@views/image-studio/store/images/imageLibrary.store'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import { promoteLegacyImagePersist } from '@views/image-studio/utils/legacyImagePersist'
import { useEffect, useState, type FC, type ReactNode } from 'react'

const ImageStudioPersistGate: FC<{ children: ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      await Promise.all([
        useImageLibraryStore.persist.rehydrate(),
        usePicturesStore.persist.rehydrate()
      ])
      await promoteLegacyImagePersist()
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return null
  return children
}

export default ImageStudioPersistGate
