import {
  DEFAULT_POSITION_ID
} from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/data'

import { DEFAULT_SLOT_OFFSET, type LayoutStateShape } from './type.layout'

export const initialLayoutState: LayoutStateShape = {
  constrainToParent: true,
  positionId: DEFAULT_POSITION_ID,
  slotOffset: {}
}
