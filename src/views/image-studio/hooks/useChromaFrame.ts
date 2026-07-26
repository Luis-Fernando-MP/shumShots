'use client'

import { useEffect, useState } from 'react'

export type ChromaContentRect = {
  left: number
  top: number
  width: number
  height: number
}

export type ChromaFrameAssets = {
  maskUrl: string
  frameUrl: string
  silhouetteUrl: string
  contentRect: ChromaContentRect
}

/** Bump when cached payload shape or detection rules change. */
const CACHE_VERSION = 5
const MAX_PROCESS_EDGE = 1600
const cache = new Map<string, ChromaFrameAssets>()
const inflight = new Map<string, Promise<ChromaFrameAssets>>()

const FULL_RECT: ChromaContentRect = { left: 0, top: 0, width: 1, height: 1 }

const cacheKey = (src: string) => `${CACHE_VERSION}:${src}`

/**
 * Inclusive chroma (screen + AA fringe). Too-strict detection shrank contentRect
 * and left black margins inside the real green zone.
 */
const isChromaGreen = (r: number, g: number, b: number, a: number) =>
  a >= 12 && g > 55 && g >= r * 1.18 && g >= b * 1.18 && g - Math.max(r, b) > 14

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
    canvas.toBlob(
      blob => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('toBlob failed'))),
      'image/png'
    )
  })

const processSize = (naturalW: number, naturalH: number) => {
  const edge = Math.max(naturalW, naturalH)
  if (edge <= MAX_PROCESS_EDGE) return { width: naturalW, height: naturalH }
  const scale = MAX_PROCESS_EDGE / edge
  return {
    width: Math.max(1, Math.round(naturalW * scale)),
    height: Math.max(1, Math.round(naturalH * scale))
  }
}

const expandRect = (rect: ChromaContentRect, pad: number): ChromaContentRect => {
  const left = Math.max(0, rect.left - pad)
  const top = Math.max(0, rect.top - pad)
  const right = Math.min(1, rect.left + rect.width + pad)
  const bottom = Math.min(1, rect.top + rect.height + pad)
  return {
    left,
    top,
    width: Math.max(0.001, right - left),
    height: Math.max(0.001, bottom - top)
  }
}

const processChromaFrame = async (src: string): Promise<ChromaFrameAssets> => {
  const img = await loadImage(src)
  const { width, height } = processSize(img.naturalWidth, img.naturalHeight)

  const frameCanvas = document.createElement('canvas')
  frameCanvas.width = width
  frameCanvas.height = height
  const frameCtx = frameCanvas.getContext('2d', { willReadFrequently: true })
  if (!frameCtx) throw new Error('2d context unavailable')

  frameCtx.drawImage(img, 0, 0, width, height)
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

  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1

  for (let i = 0; i < pixels.length; i += 4) {
    const pixelIndex = i / 4
    const x = pixelIndex % width
    const y = (pixelIndex / width) | 0
    const r = pixels[i] ?? 0
    const g = pixels[i + 1] ?? 0
    const b = pixels[i + 2] ?? 0
    const a = pixels[i + 3] ?? 0

    const chroma = isChromaGreen(r, g, b, a)

    if (chroma || a > 0) {
      silhouettePixels[i] = 0
      silhouettePixels[i + 1] = 0
      silhouettePixels[i + 2] = 0
      silhouettePixels[i + 3] = chroma ? 255 : a
    }

    if (!chroma) continue

    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y

    pixels[i + 3] = 0
    maskPixels[i] = 255
    maskPixels[i + 1] = 255
    maskPixels[i + 2] = 255
    maskPixels[i + 3] = 255
  }

  frameCtx.putImageData(frameData, 0, 0)
  maskCtx.putImageData(maskData, 0, 0)
  silhouetteCtx.putImageData(silhouetteData, 0, 0)

  const rawRect: ChromaContentRect =
    maxX >= minX && maxY >= minY
      ? {
          left: minX / width,
          top: minY / height,
          width: (maxX - minX + 1) / width,
          height: (maxY - minY + 1) / height
        }
      : FULL_RECT

  const contentRect = rawRect === FULL_RECT ? FULL_RECT : expandRect(rawRect, 0.003)

  const [frameUrl, maskUrl, silhouetteUrl] = await Promise.all([
    toBlobUrl(frameCanvas),
    toBlobUrl(maskCanvas),
    toBlobUrl(silhouetteCanvas)
  ])
  return { frameUrl, maskUrl, silhouetteUrl, contentRect }
}

export const useChromaFrame = (src: string | null | undefined) => {
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
