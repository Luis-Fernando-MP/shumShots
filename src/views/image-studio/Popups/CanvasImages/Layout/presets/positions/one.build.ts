import { SLOT_QUANTITY_CONFIG } from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'

import { buildSlots } from './helpers'
import type { SlotBuildContext, SlotPlacement } from './types'

const N = SLOT_QUANTITY_CONFIG.ONE

export const buildGrid = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (_, size) => ({
    x: (ctx.canvasWidth - size.width) / 2,
    y: (ctx.canvasHeight - size.height) / 2
  }))
