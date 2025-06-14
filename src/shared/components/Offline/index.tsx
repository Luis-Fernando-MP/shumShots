'use client'

import { toaster } from '@shared/components/Toast'
import { useCallback, useEffect } from 'react'

import useOfflineStore from './offline.store'

const Offline = () => {
  const { isOffline, setIsOffline } = useOfflineStore()

  useEffect(() => {
    const updateNetworkStatus = () => setIsOffline(!navigator.onLine)

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [setIsOffline])

  const showToast = useCallback(() => {
    const toastId = 'offline'
    if (isOffline === null) return
    if (isOffline) {
      return toaster({ title: '😟 Te haz quedado sin internet', type: 'error', id: toastId })
    }
    return toaster({ title: '🙂 Estamos de regreso', id: toastId })
  }, [isOffline])

  useEffect(() => {
    showToast()
  }, [isOffline, showToast])

  return null
}

export default Offline
