import {
  type BorderConfigurationState,
  type BorderFinish,
  type BorderType,
  createBorderStore
} from '@views/image-studio/Popups/common/components/createBorderStore'
import { create } from 'zustand'

export type { BorderConfigurationState, BorderFinish, BorderType }

const useCanvasBorderStore = create(createBorderStore({ size: 4 }))

export default useCanvasBorderStore
