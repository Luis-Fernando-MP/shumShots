import { cn } from '@common/utils/cn'

/**
 * Tile de chrome: 12px, relleno muted, sin pelo en reposo.
 * Activo = wash `primary/25`, sin ring ni marco extra.
 *
 * @param active - Si el preset está seleccionado.
 */
export const chromeTile = (active = false) =>
  cn(
    'rounded-[12px] border border-transparent bg-muted transition-colors',
    active && 'bg-primary/25'
  )

/**
 * Marco sobre un preview (gradiente, foto). El relleno lo pinta el hijo.
 * En reposo no hay pelo; activo = 1px primary/30 porque el fill tapa el wash.
 *
 * @param active - Si el preset está seleccionado.
 */
export const chromeFrame = (active = false) =>
  cn(
    'rounded-[12px] border border-transparent transition-colors',
    active && 'border-primary/60'
  )
