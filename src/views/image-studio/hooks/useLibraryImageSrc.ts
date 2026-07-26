'use client'

import { getImageSrc, peekImageSrc } from '@views/image-studio/utils/imageBlobDb'
import { useEffect, useState } from 'react'

const useLibraryImageSrc = (id: string | null | undefined, enabled = true) => {
  const [src, setSrc] = useState<string | null>(() =>
    id && enabled ? peekImageSrc(id) : null
  )

  useEffect(() => {
    if (!id || !enabled) {
      setSrc(null)
      return
    }

    const cached = peekImageSrc(id)
    if (cached) {
      setSrc(cached)
      return
    }

    let cancelled = false
    void getImageSrc(id).then(url => {
      if (!cancelled) setSrc(url)
    })
    return () => {
      cancelled = true
    }
  }, [id, enabled])

  return src
}

export default useLibraryImageSrc
