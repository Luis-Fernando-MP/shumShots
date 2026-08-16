'use client'

import useFrameStore from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import useShadowStore from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import { TABS_SCOPES } from '@views/image-studio/constants'
import {
  ensureTabsStores,
  getTabsStore,
  rehydrateAllTabsStores
} from '@views/image-studio/Popups/common/components/tabs/store'
import useCornerStore from '@views/image-studio/Popups/CanvasImages/Corner/store/corner/store'
import useImageLibraryStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/imageLibrary'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import useLayoutStore, {
  migrateLegacyGridPersist
} from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import useSizeStore from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import { promoteLegacyImagePersist } from '@views/image-studio/utils/legacyImagePersist'
import { useEffect, useState, type FC, type ReactNode } from 'react'

const syncDomainTabs = () => {
  useCornerStore.getState().syncTabs(getTabsStore(TABS_SCOPES.corner).getState().layers)
  useFrameStore.getState().syncTabs(getTabsStore(TABS_SCOPES.frame).getState().layers)
  useShadowStore.getState().syncTabs(getTabsStore(TABS_SCOPES.shadow).getState().layers)
  const sizeTabs = getTabsStore(TABS_SCOPES.size).getState()
  useSizeStore.getState().syncFromTabs(sizeTabs.layers, sizeTabs.activeLayerId)
}

/**
 * Gate de persistencia para Image Studio.
 * 
 * Asegura que todos los stores de dominio y de pestañas (Tabs) estén
 * hidratados antes de renderizar la aplicación, sincronizando el estado
 * inicial con las capas de selección.
 * 
 * @param props - Propiedades del componente.
 * @param props.children - Contenido a renderizar tras la hidratación.
 * @returns El contenido o null mientras carga.
 */
const ImageStudioPersistGate: FC<{ children: ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      ensureTabsStores()
      await rehydrateAllTabsStores()
      migrateLegacyGridPersist()
      await Promise.all([
        useImageLibraryStore.persist.rehydrate(),
        usePicturesStore.persist.rehydrate(),
        useShadowStore.persist.rehydrate(),
        useFrameStore.persist.rehydrate(),
        useCanvasLightStore.persist.rehydrate(),
        useCornerStore.persist.rehydrate(),
        useSizeStore.persist.rehydrate(),
        useLayoutStore.persist.rehydrate()
      ])
      syncDomainTabs()
      await promoteLegacyImagePersist()
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      {ready && children}
    </>
  )
}

export default ImageStudioPersistGate
