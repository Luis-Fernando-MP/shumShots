'use client'

import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

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
      return toast.loading('😟 Te haz quedado sin internet', { id: toastId })
    }
    toast.success('🙂 Estamos de regreso', { id: toastId })
  }, [isOffline])

  useEffect(() => {
    showToast()
  }, [isOffline, showToast])

  return null
}

export default Offline
