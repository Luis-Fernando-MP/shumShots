'use client'

import { useEffect, useState } from 'react'

type ChromaFrameAssets = {
  maskUrl: string
  frameUrl: string
  silhouetteUrl: string
}

const CACHE_VERSION = 2
const cache = new Map<string, ChromaFrameAssets>()
const inflight = new Map<string, Promise<ChromaFrameAssets>>()

const cacheKey = (src: string) => `${CACHE_VERSION}:${src}`

const isChromaGreen = (r: number, g: number, b: number, a: number) =>
  a >= 20 && g > 90 && g >= r * 1.35 && g >= b * 1.35 && g - Math.max(r, b) > 25

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load frame: ${src}`))
    img.src = src
  })

const toBlobUrl = (canvas: HTMLCanvasElement) =>
  new Promise<string>((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('toBlob failed'))), 'image/png')
  })

const processChromaFrame = async (src: string): Promise<ChromaFrameAssets> => {
  const img = await loadImage(src)
  const width = img.naturalWidth
  const height = img.naturalHeight

  const frameCanvas = document.createElement('canvas')
  frameCanvas.width = width
  frameCanvas.height = height
  const frameCtx = frameCanvas.getContext('2d', { willReadFrequently: true })
  if (!frameCtx) throw new Error('2d context unavailable')

  frameCtx.drawImage(img, 0, 0)
  const frameData = frameCtx.getImageData(0, 0, width, height)
  const pixels = frameData.data

  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = width
  maskCanvas.height = height
  const maskCtx = maskCanvas.getContext('2d')
  if (!maskCtx) throw new Error('2d context unavailable')
  const maskData = maskCtx.createImageData(width, height)
  const maskPixels = maskData.data

  const silhouetteCanvas = document.createElement('canvas')
  silhouetteCanvas.width = width
  silhouetteCanvas.height = height
  const silhouetteCtx = silhouetteCanvas.getContext('2d')
  if (!silhouetteCtx) throw new Error('2d context unavailable')
  const silhouetteData = silhouetteCtx.createImageData(width, height)
  const silhouettePixels = silhouetteData.data

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0
    const g = pixels[i + 1] ?? 0
    const b = pixels[i + 2] ?? 0
    const a = pixels[i + 3] ?? 0

    if (a >= 20) {
      silhouettePixels[i] = 0
      silhouettePixels[i + 1] = 0
      silhouettePixels[i + 2] = 0
      silhouettePixels[i + 3] = 255
    }

    if (!isChromaGreen(r, g, b, a)) continue
    pixels[i + 3] = 0
    maskPixels[i] = 255
    maskPixels[i + 1] = 255
    maskPixels[i + 2] = 255
    maskPixels[i + 3] = 255
  }

  frameCtx.putImageData(frameData, 0, 0)
  maskCtx.putImageData(maskData, 0, 0)
  silhouetteCtx.putImageData(silhouetteData, 0, 0)

  const [frameUrl, maskUrl, silhouetteUrl] = await Promise.all([
    toBlobUrl(frameCanvas),
    toBlobUrl(maskCanvas),
    toBlobUrl(silhouetteCanvas)
  ])
  return { frameUrl, maskUrl, silhouetteUrl }
}

export const useChromaFrame = (src: string | null | undefined) => {
  const [assets, setAssets] = useState<ChromaFrameAssets | null>(() => (src ? (cache.get(cacheKey(src)) ?? null) : null))

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

    let cancelled = false
    let run = inflight.get(key)

    if (!run) {
      run = processChromaFrame(src)
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
  }, [src])

  return assets
}
