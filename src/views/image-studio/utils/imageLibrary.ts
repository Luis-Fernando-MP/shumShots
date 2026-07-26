import useImageLibraryStore, {
  type LibraryImage
} from '@views/image-studio/store/images/imageLibrary.store'

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('No se pudo leer el archivo'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })

export const importStudioImage = async (file: File): Promise<LibraryImage> => {
  const raw = await fileToDataUrl(file)
  const compressed = await compressImageDataUrl(raw)
  return useImageLibraryStore.getState().addImage({
    dataUrl: compressed.dataUrl,
    width: compressed.width,
    height: compressed.height,
    bytes: compressed.bytes
  })
}

export const compressImageDataUrl = async (
  dataUrl: string,
  options?: { maxEdge?: number; quality?: number }
): Promise<{ dataUrl: string; width: number; height: number; bytes: number }> => {
  const maxEdge = options?.maxEdge ?? 1280
  const quality = options?.quality ?? 0.72

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const node = new Image()
    node.onload = () => resolve(node)
    node.onerror = () => reject(new Error('Imagen inválida'))
    node.src = dataUrl
  })

  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight))
  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')

  ctx.drawImage(img, 0, 0, width, height)
  const compressed = canvas.toDataURL('image/jpeg', quality)
  const bytes = Math.round((compressed.length * 3) / 4)

  return { dataUrl: compressed, width, height, bytes }
}

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
