import BaseWorker from '@common/lib/client-worker/BaseWorker'

export type ChromaContentRect = {
  left: number
  top: number
  width: number
  height: number
}

export type ChromaFrameResult = {
  frameBlob: Blob
  maskBlob: Blob
  silhouetteBlob: Blob
  contentRect: ChromaContentRect
}

const MAX_PROCESS_EDGE = 2400
const FULL_RECT: ChromaContentRect = { left: 0, top: 0, width: 1, height: 1 }

const isChromaGreen = (r: number, g: number, b: number, a: number) =>
  a >= 12 && g > 55 && g >= r * 1.18 && g >= b * 1.18 && g - Math.max(r, b) > 14

const processSize = (naturalWidth: number, naturalHeight: number) => {
  const edge = Math.max(naturalWidth, naturalHeight)
  if (edge <= MAX_PROCESS_EDGE) return { width: naturalWidth, height: naturalHeight }
  const scale = MAX_PROCESS_EDGE / edge
  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale))
  }
}

export class ChromaFrameWorker extends BaseWorker {
  async processFrame(src: string): Promise<ChromaFrameResult> {
    const response = await fetch(src)
    if (!response.ok) throw new Error(`Failed to load frame: ${src}`)

    const bitmap = await createImageBitmap(await response.blob())
    const { width, height } = processSize(bitmap.width, bitmap.height)
    const frameCanvas = new OffscreenCanvas(width, height)
    const frameContext = frameCanvas.getContext('2d', { willReadFrequently: true })
    if (!frameContext) throw new Error('2d context unavailable')

    frameContext.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const frameData = frameContext.getImageData(0, 0, width, height)
    const pixels = frameData.data
    const maskCanvas = new OffscreenCanvas(width, height)
    const maskContext = maskCanvas.getContext('2d')
    if (!maskContext) throw new Error('2d context unavailable')
    const maskData = maskContext.createImageData(width, height)
    const maskPixels = maskData.data
    const silhouetteCanvas = new OffscreenCanvas(width, height)
    const silhouetteContext = silhouetteCanvas.getContext('2d')
    if (!silhouetteContext) throw new Error('2d context unavailable')
    const silhouetteData = silhouetteContext.createImageData(width, height)
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

    frameContext.putImageData(frameData, 0, 0)
    maskContext.putImageData(maskData, 0, 0)
    silhouetteContext.putImageData(silhouetteData, 0, 0)

    const hasChroma = maxX >= minX && maxY >= minY
    const padX = Math.ceil(width * 0.003)
    const padY = Math.ceil(height * 0.003)
    const cropLeft = hasChroma ? Math.max(0, minX - padX) : 0
    const cropTop = hasChroma ? Math.max(0, minY - padY) : 0
    const cropRight = hasChroma ? Math.min(width, maxX + 1 + padX) : width
    const cropBottom = hasChroma ? Math.min(height, maxY + 1 + padY) : height
    const cropWidth = Math.max(1, cropRight - cropLeft)
    const cropHeight = Math.max(1, cropBottom - cropTop)
    const croppedMaskCanvas = new OffscreenCanvas(cropWidth, cropHeight)
    const croppedMaskContext = croppedMaskCanvas.getContext('2d')
    if (!croppedMaskContext) throw new Error('2d context unavailable')

    croppedMaskContext.drawImage(
      maskCanvas,
      cropLeft,
      cropTop,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    )

    const contentRect = hasChroma
      ? {
          left: cropLeft / width,
          top: cropTop / height,
          width: cropWidth / width,
          height: cropHeight / height
        }
      : FULL_RECT

    const [frameBlob, maskBlob, silhouetteBlob] = await Promise.all([
      frameCanvas.convertToBlob({ type: 'image/png' }),
      croppedMaskCanvas.convertToBlob({ type: 'image/png' }),
      silhouetteCanvas.convertToBlob({ type: 'image/png' })
    ])

    return { frameBlob, maskBlob, silhouetteBlob, contentRect }
  }
}

new ChromaFrameWorker()
