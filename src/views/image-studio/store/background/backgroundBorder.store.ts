import {
  type BorderConfigurationState,
  type BorderFinish,
  type BorderType,
  createBorderStore
} from '@views/image-studio/store/border/createBorderStore'
import { create } from 'zustand'

export type { BorderConfigurationState, BorderFinish, BorderType }

const useBackgroundBorderStore = create(createBorderStore({ size: 4 }))

export default useBackgroundBorderStore
