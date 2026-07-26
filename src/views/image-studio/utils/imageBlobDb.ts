const DB_NAME = 'pixis-images'
const STORE = 'blobs'
const VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null

const openDb = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'))
      return
    }
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => {
      const db = req.result
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }
    req.onerror = () => {
      dbPromise = null
      reject(req.error ?? new Error('IndexedDB open failed'))
    }
  })
  return dbPromise
}

const tx = async <T,>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode)
    const request = run(transaction.objectStore(STORE))
    let result: T | undefined
    request.onsuccess = () => {
      result = request.result
    }
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
    transaction.oncomplete = () => resolve(result as T)
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB tx failed'))
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB tx aborted'))
  })
}

const urlCache = new Map<string, string>()
const inflight = new Map<string, Promise<string | null>>()

const dataUrlToBlob = async (dataUrl: string) => {
  const res = await fetch(dataUrl)
  return res.blob()
}

const cacheUrl = (id: string, blob: Blob) => {
  const prev = urlCache.get(id)
  if (prev) URL.revokeObjectURL(prev)
  const url = URL.createObjectURL(blob)
  urlCache.set(id, url)
  return url
}

export const putImageBlob = async (id: string, dataUrl: string) => {
  const blob = await dataUrlToBlob(dataUrl)
  await tx('readwrite', store => store.put(blob, id))
  return cacheUrl(id, blob)
}

export const getImageSrc = (id: string): Promise<string | null> => {
  const cached = urlCache.get(id)
  if (cached) return Promise.resolve(cached)

  const pending = inflight.get(id)
  if (pending) return pending

  const task = tx<Blob | undefined>('readonly', store => store.get(id))
    .then(blob => {
      if (!blob) return null
      return cacheUrl(id, blob)
    })
    .catch(() => null)
    .finally(() => {
      inflight.delete(id)
    })

  inflight.set(id, task)
  return task
}

export const deleteImageBlob = async (id: string) => {
  await tx('readwrite', store => store.delete(id))
  const prev = urlCache.get(id)
  if (prev) URL.revokeObjectURL(prev)
  urlCache.delete(id)
  inflight.delete(id)
}

export const peekImageSrc = (id: string) => urlCache.get(id) ?? null
