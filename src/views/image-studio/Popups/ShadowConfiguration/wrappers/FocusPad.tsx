'use client'

import { cn } from '@common/utils/cn'
import { useActiveLayerPreview } from '@views/image-studio/hooks/useShadowVisualStyles'
import useShadowStore, {
  LIGHT_PRESETS,
  SHADOW_PRESETS,
  type LightType,
  type ShadowType
} from '@views/image-studio/store/shadow/shadow.store'
import { SunIcon } from 'lucide-react'
import { type FC, type PointerEvent as ReactPointerEvent, useRef, useState } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

type Kind = 'shadow' | 'light'
type SunPos = { x: number; y: number }

const SUN_MARGIN = 0.06

const THROW: Record<Exclude<ShadowType, 'none'>, number> = {
  soft: 130,
  contact: 125,
  deep: 180,
  crisp: 105,
  ambient: 72
}

const BLUR_GROW: Record<Exclude<ShadowType, 'none'>, number> = {
  soft: 48,
  contact: 36,
  deep: 72,
  crisp: 22,
  ambient: 24
}

const SPREAD_GROW: Record<Exclude<ShadowType, 'none'>, number> = {
  soft: 0,
  contact: 2,
  deep: 8,
  crisp: 0,
  ambient: 10
}

const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))
const nearlySame = (a: SunPos, b: SunPos) => Math.abs(a.x - b.x) < 1e-4 && Math.abs(a.y - b.y) < 1e-4

const shadowPreset = (type: ShadowType) =>
  SHADOW_PRESETS.find(item => item.type === type) ?? SHADOW_PRESETS[0]
const lightPreset = (type: LightType) =>
  LIGHT_PRESETS.find(item => item.type === type) ?? LIGHT_PRESETS[0]

const sunFromShadowPosition = (type: ShadowType, position: { x: number; y: number }): SunPos => {
  if (type === 'none') return { x: 0.5, y: 0.5 }
  const throwPx = THROW[type] || 1
  return {
    x: clamp01(-position.x / throwPx / 2 + 0.5, SUN_MARGIN),
    y: clamp01(-position.y / throwPx / 2 + 0.5, SUN_MARGIN)
  }
}

const applyFocus = (nx: number, ny: number, source: Kind) => {
  const state = useShadowStore.getState()
  const shadow =
    state.shadowLayers.find(layer => layer.id === state.activeShadowId) ?? state.shadowLayers[0]
  const light =
    state.lightLayers.find(layer => layer.id === state.activeLightId) ?? state.lightLayers[0]
  const canLink = Boolean(shadow && shadow.type !== 'none' && light && light.type !== 'none')
  const linked = state.linkFocus && canLink
  const touchShadow = source === 'shadow' || linked
  const touchLight = source === 'light' || linked

  let shadowPatch: Parameters<typeof state.updateActiveShadow>[0] | null = null
  let lightPatch: Parameters<typeof state.updateActiveLight>[0] | null = null

  if (touchShadow && shadow && shadow.type !== 'none') {
    const base = shadowPreset(shadow.type)
    const relX = (nx - 0.5) * 2
    const relY = (ny - 0.5) * 2
    const distance = Math.min(1, Math.hypot(relX, relY))
    const throwPx = THROW[shadow.type]
    const position = { x: -relX * throwPx, y: -relY * throwPx }
    const blur = Math.max(0, base.blur + distance * BLUR_GROW[shadow.type])
    const spread = base.spread + distance * SPREAD_GROW[shadow.type]
    if (
      Math.abs(shadow.position.x - position.x) > 1e-3 ||
      Math.abs(shadow.position.y - position.y) > 1e-3 ||
      Math.abs(shadow.blur - blur) > 1e-3 ||
      Math.abs(shadow.spread - spread) > 1e-3
    ) {
      shadowPatch = { position, blur, spread }
    }
  }

  if (touchLight && light && light.type !== 'none') {
    const base = lightPreset(light.type)
    const distance = Math.min(1, Math.hypot((nx - 0.5) * 2, (ny - 0.5) * 2))
    let size = base.size
    if (light.type === 'soft') size = base.size + distance * 10
    else if (light.type === 'beam') size = Math.max(32, base.size - distance * 6)
    else if (light.type === 'rim') size = base.size + distance * 8
    else if (light.type === 'warm' || light.type === 'cool') size = base.size + distance * 12

    if (
      Math.abs(light.focus.x - nx) > 1e-4 ||
      Math.abs(light.focus.y - ny) > 1e-4 ||
      Math.abs(light.size - size) > 1e-3
    ) {
      lightPatch = { focus: { x: nx, y: ny }, size }
    }
  }

  if (shadowPatch && lightPatch) {
    useShadowStore.setState(s => ({
      shadowLayers: s.shadowLayers.map(layer =>
        layer.id === s.activeShadowId ? { ...layer, ...shadowPatch } : layer
      ),
      lightLayers: s.lightLayers.map(layer =>
        layer.id === s.activeLightId ? { ...layer, ...lightPatch } : layer
      )
    }))
    return
  }
  if (shadowPatch) state.updateActiveShadow(shadowPatch)
  if (lightPatch) state.updateActiveLight(lightPatch)
}

const FocusPad: FC<{ kind: Kind }> = ({ kind }) => {
  const { shadow, light, boxShadow, lightOverlay } = useActiveLayerPreview()
  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [dragSun, setDragSun] = useState<SunPos | null>(null)

  const shadowType = shadow?.type ?? 'none'
  const lightType = light?.type ?? 'none'
  const disabled = kind === 'shadow' ? shadowType === 'none' : lightType === 'none'
  const linkFocus = useShadowStore(s => s.linkFocus)
  const linked = linkFocus && shadowType !== 'none' && lightType !== 'none'

  const storeSun =
    kind === 'shadow'
      ? sunFromShadowPosition(shadowType, shadow?.position ?? { x: 0, y: 0 })
      : { x: light?.focus.x ?? 0.55, y: light?.focus.y ?? 0.28 }
  const sun = dragSun ?? storeSun

  const moveSun = (event: ReactPointerEvent) => {
    const pad = padRef.current
    if (!pad || disabled) return
    const rect = pad.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const next = {
      x: clamp01((event.clientX - rect.left) / rect.width, SUN_MARGIN),
      y: clamp01((event.clientY - rect.top) / rect.height, SUN_MARGIN)
    }
    setDragSun(prev => (prev && nearlySame(prev, next) ? prev : next))
    applyFocus(next.x, next.y, kind)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    setDragSun(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <SectionBlock
      title='Foco'
      level={2}
      description={
        linked
          ? 'Foco unido: luz en el sol, sombra al lado opuesto. Solo capas activas.'
          : 'Mueve esta capa activa. Dirección y difuminado; la intensidad va en el slider.'
      }
    >
      <div
        ref={padRef}
        className={cn(
          'bg-muted/30 relative mx-auto flex aspect-square w-full max-w-[220px] touch-none items-center justify-center overflow-hidden rounded-md ring-1 ring-inset ring-border/40',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair'
        )}
        onPointerDown={event => {
          if (disabled) return
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          moveSun(event)
        }}
        onPointerMove={event => {
          if (!dragging.current || disabled) return
          moveSun(event)
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {kind === 'light' && lightOverlay && (
          <div className='pointer-events-none absolute inset-0' style={lightOverlay} />
        )}
        <div
          className='bg-primary/45 pointer-events-none relative z-[1] size-14 rounded-md'
          style={kind === 'shadow' ? { boxShadow } : undefined}
        />
        <div
          className='bg-card text-foreground pointer-events-none absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border'
          style={{ left: `${sun.x * 100}%`, top: `${sun.y * 100}%` }}
        >
          <SunIcon className='size-3.5' />
        </div>
      </div>
    </SectionBlock>
  )
}

export default FocusPad
