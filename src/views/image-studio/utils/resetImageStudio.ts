import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import useCanvasRadiusStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import usePortraitStore from '@views/image-studio/Popups/Canvas/Portrait/store/portrait/store'
import useCornerStore from '@views/image-studio/Popups/CanvasImages/Corner/store/corner/store'
import useFrameStore from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import { purgeRemovedSlots } from '@views/image-studio/Popups/CanvasImages/ImagesCount/builders/CountBuilder'
import { SLOT_QUANTITY_CONFIG } from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'
import useImageLibraryStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/imageLibrary'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import useShadowStore from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import useSizeStore from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import useTextLayersStore from '@views/image-studio/Popups/CanvasImages/TextLayers/store/text-layers/store'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { ALL_TAB_SCOPES } from '@views/image-studio/constants'

/**
 * Restaura todos los dominios del editor de imagen.
 */
export const resetImageStudio = () => {
  useBackgroundStore.getState().resetBackground()
  useCanvasBorderStore.getState().resetBorder()
  useCanvasRadiusStore.getState().resetBackgroundRadius?.()
  useCanvasLightStore.getState().reset()
  useCornerStore.getState().reset()
  useFrameStore.getState().reset()
  useShadowStore.getState().reset()
  useLayoutStore.getState().reset()
  useSizeStore.getState().reset()
  usePortraitStore.getState().reset()
  useTextLayersStore.getState().reset()

  for (const scope of ALL_TAB_SCOPES) {
    getTabsStore(scope).getState().reset()
  }

  const pictures = usePicturesStore.getState()
  const library = useImageLibraryStore.getState()
  for (const image of library.images) pictures.clearLibraryRefs(image.id)
  library.clearAll()
  const removed = pictures.setCount(SLOT_QUANTITY_CONFIG.ONE)
  purgeRemovedSlots(removed)
  useLayoutStore.getState().syncPositionForCount(SLOT_QUANTITY_CONFIG.ONE)
}
