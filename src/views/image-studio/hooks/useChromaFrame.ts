'use client'

import { useSingletonWorker } from '@common/lib/client-worker'
import { useEffect, useState } from 'react'

import type {
  ChromaContentRect,
  ChromaFrameResult,
  ChromaFrameWorker
} from './chromaFrame.worker'

export type { ChromaContentRect }

export type ChromaFrameAssets = {
  maskUrl: string
  frameUrl: string
  silhouetteUrl: string
  contentRect: ChromaContentRect
}

const CACHE_VERSION = 7
const WORKER_GROUP = 'image-studio:chroma-frame'
const cache = new Map<string, ChromaFrameAssets>()
const inflight = new Map<string, Promise<ChromaFrameAssets>>()

const cacheKey = (src: string) => `${CACHE_VERSION}:${src}`

const createChromaFrameWorker = () =>
  new Worker(new URL('./chromaFrame.worker.ts', import.meta.url), { type: 'module' })

const toAssets = (result: ChromaFrameResult): ChromaFrameAssets => ({
  frameUrl: URL.createObjectURL(result.frameBlob),
  maskUrl: URL.createObjectURL(result.maskBlob),
  silhouetteUrl: URL.createObjectURL(result.silhouetteBlob),
  contentRect: result.contentRect
})

export const useChromaFrame = (src: string | null | undefined) => {
  const { workerRef, ready } = useSingletonWorker<ChromaFrameWorker>({
    worker: createChromaFrameWorker,
    group: WORKER_GROUP
  })
  const [assets, setAssets] = useState<ChromaFrameAssets | null>(() =>
    src ? (cache.get(cacheKey(src)) ?? null) : null
  )

  useEffect(() => {
    if (!src) {
      setAssets(null)
      return
    }

    const key = cacheKey(src)
    const cached = cache.get(key)
    if (cached) {
      setAssets(cached)
      return
    }

    if (!ready) return

    const remoteWorker = workerRef.current
    if (!remoteWorker) return

    let cancelled = false
    let run = inflight.get(key)

    if (!run) {
      run = remoteWorker
        .processFrame(src)
        .then(toAssets)
        .then(result => {
          cache.set(key, result)
          return result
        })
        .finally(() => {
          inflight.delete(key)
        })
      inflight.set(key, run)
    }

    run
      .then(result => {
        if (!cancelled) setAssets(result)
      })
      .catch(() => {
        if (!cancelled) setAssets(null)
      })

    return () => {
      cancelled = true
    }
  }, [ready, src, workerRef])

  return assets
}
