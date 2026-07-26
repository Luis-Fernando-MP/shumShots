import useImageLibraryStore, { type LibraryImage } from '@views/image-studio/store/images/imageLibrary.store'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import { putImageBlob } from '@views/image-studio/utils/imageBlobDb'

const LEGACY_DB = 'pixis-persist-db'
const LEGACY_STORE = 'kv'

const readLegacyKv = (key: string): Promise<string | null> =>
  new Promise(resolve => {
    if (typeof indexedDB === 'undefined') {
      resolve(null)
      return
    }
    const open = indexedDB.open(LEGACY_DB)
    open.onerror = () => resolve(null)
    open.onsuccess = () => {
      const db = open.result
      if (!db.objectStoreNames.contains(LEGACY_STORE)) {
        db.close()
        resolve(null)
        return
      }
      const req = db.transaction(LEGACY_STORE, 'readonly').objectStore(LEGACY_STORE).get(key)
      req.onsuccess = () => {
        const value = req.result
        db.close()
        resolve(typeof value === 'string' ? value : value == null ? null : String(value))
      }
      req.onerror = () => {
        db.close()
        resolve(null)
      }
    }
  })

export const promoteLegacyImagePersist = async () => {
  if (useImageLibraryStore.getState().images.length === 0) {
    const raw = await readLegacyKv('pixis-image-library')
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { state?: { images?: unknown[] } }
        const list = parsed.state?.images
        if (Array.isArray(list) && list.length > 0) {
          const images: LibraryImage[] = []
          for (const entry of list) {
            if (!entry || typeof entry !== 'object') continue
            const item = entry as Record<string, unknown>
            if (typeof item.id !== 'string' || typeof item.name !== 'string') continue
            if (typeof item.dataUrl === 'string') await putImageBlob(item.id, item.dataUrl)
            images.push({
              id: item.id,
              name: item.name,
              width: typeof item.width === 'number' ? item.width : 0,
              height: typeof item.height === 'number' ? item.height : 0,
              bytes: typeof item.bytes === 'number' ? item.bytes : 0,
              createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
              active: item.active !== false
            })
          }
          if (images.length > 0) useImageLibraryStore.setState({ images })
        }
      } catch {
        // ignore
      }
    }
  }

  const slots = usePicturesStore.getState()
  if (slots.pictures.some(item => item.libraryId)) return

  const rawSlots = await readLegacyKv('pixis-picture-slots')
  if (!rawSlots) return
  try {
    const parsed = JSON.parse(rawSlots) as {
      state?: { pictures?: typeof slots.pictures; count?: number; selectedId?: string }
    }
    const pictures = parsed.state?.pictures
    if (!Array.isArray(pictures) || pictures.length === 0) return
    usePicturesStore.setState({
      pictures,
      count: typeof parsed.state?.count === 'number' ? parsed.state.count : pictures.length,
      selectedId: parsed.state?.selectedId ?? slots.selectedId
    })
  } catch {
    // ignore
  }
}
