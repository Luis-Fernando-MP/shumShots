'use client'

import useFrameStore from '@views/image-studio/Popups/FrameConfiguration/store'
import useShadowStore from '@views/image-studio/Popups/ShadowConfiguration/store'
import { TABS_SCOPES } from '@views/image-studio/constants'
import {
  ensureTabsStores,
  getTabsStore,
  rehydrateAllTabsStores
} from '@views/image-studio/shared/components/tabs/store'
import useCornerStore from '@views/image-studio/store/corner'
import useImageLibraryStore from '@views/image-studio/store/images/imageLibrary.store'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import useGridStore from '@views/image-studio/store/grid'
import useSizeStore from '@views/image-studio/store/size'
import { promoteLegacyImagePersist } from '@views/image-studio/utils/legacyImagePersist'
import { useEffect, useState, type FC, type ReactNode } from 'react'

const syncDomainTabs = () => {
  useCornerStore.getState().syncTabs(getTabsStore(TABS_SCOPES.corner).getState().layers)
  useFrameStore.getState().syncTabs(getTabsStore(TABS_SCOPES.frame).getState().layers)
  useShadowStore.getState().syncTabs(getTabsStore(TABS_SCOPES.shadow).getState().layers)
  const sizeTabs = getTabsStore(TABS_SCOPES.size).getState()
  useSizeStore.getState().syncFromTabs(sizeTabs.layers, sizeTabs.activeLayerId)
}

const ImageStudioPersistGate: FC<{ children: ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      ensureTabsStores()
      await rehydrateAllTabsStores()
      await Promise.all([
        useImageLibraryStore.persist.rehydrate(),
        usePicturesStore.persist.rehydrate(),
        useShadowStore.persist.rehydrate(),
        useFrameStore.persist.rehydrate(),
        useCornerStore.persist.rehydrate(),
        useSizeStore.persist.rehydrate(),
        useGridStore.persist.rehydrate()
      ])
      syncDomainTabs()
      await promoteLegacyImagePersist()
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return null
  return children
}

export default ImageStudioPersistGate
