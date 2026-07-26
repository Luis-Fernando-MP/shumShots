'use client'

import { cn } from '@common/utils/cn'
import { LIGHT_DATA, LIGHT_PRESETS, normalizeLightType, type LightType } from '@views/image-studio/fx/light'
import { SHADOW_DATA, SHADOW_PRESETS, type ShadowType } from '@views/image-studio/fx/shadow'
import { useActiveLayerPreview } from '@views/image-studio/hooks/useShadowVisualStyles'
import useShadowStore from '@views/image-studio/Popups/ShadowConfiguration/store'
import { SunIcon } from 'lucide-react'
import { type FC, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

type Kind = 'shadow' | 'light'
type SunPos = { x: number; y: number }

const SUN_MARGIN = 0.06

const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))
const nearlySame = (a: SunPos, b: SunPos) => Math.abs(a.x - b.x) < 1e-4 && Math.abs(a.y - b.y) < 1e-4
const round1 = (value: number) => Math.round(value * 10) / 10

const shadowPreset = (type: ShadowType) =>
  SHADOW_PRESETS.find(item => item.type === type) ?? SHADOW_PRESETS[0]
const lightPreset = (type: LightType) =>
  LIGHT_PRESETS.find(item => item.type === type) ?? LIGHT_PRESETS[0]

const sunFromShadowPosition = (type: ShadowType, position: { x: number; y: number }): SunPos => {
  if (type === 'none') return { x: 0.5, y: 0.5 }
  const throwPx = SHADOW_DATA[type].pad.throw || 1
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
    const pad = SHADOW_DATA[shadow.type].pad
    const relX = (nx - 0.5) * 2
    const relY = (ny - 0.5) * 2
    const distance = Math.min(1, Math.hypot(relX, relY))
    const throwPx = pad.throw
    const position = {
      x: round1(-relX * throwPx),
      y: round1(-relY * throwPx)
    }
    const blur = round1(Math.max(0, base.blur + distance * pad.blurGrow))
    const spread = round1(base.spread + distance * pad.spreadGrow)
    if (
      Math.abs(shadow.position.x - position.x) > 0.05 ||
      Math.abs(shadow.position.y - position.y) > 0.05 ||
      Math.abs(shadow.blur - blur) > 0.05 ||
      Math.abs(shadow.spread - spread) > 0.05
    ) {
      shadowPatch = { position, blur, spread }
    }
  }

  if (touchLight && light && light.type !== 'none') {
    const lightType = normalizeLightType(light.type)
    if (lightType !== 'none') {
      const base = lightPreset(lightType)
      const pad = LIGHT_DATA[lightType].pad
      const distance = Math.min(1, Math.hypot((nx - 0.5) * 2, (ny - 0.5) * 2))
      let size = base.size + distance * pad.sizeGrow
      if ('sizeMin' in pad && typeof pad.sizeMin === 'number') {
        size = Math.max(pad.sizeMin, size)
      }
      size = round1(size)
      const focus = { x: round1(nx * 1000) / 1000, y: round1(ny * 1000) / 1000 }

      if (
        Math.abs(light.focus.x - focus.x) > 0.002 ||
        Math.abs(light.focus.y - focus.y) > 0.002 ||
        Math.abs(light.size - size) > 0.05
      ) {
        lightPatch = { focus, size }
      }
    }
  }

  if (!shadowPatch && !lightPatch) return

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
  const pendingFocus = useRef<SunPos | null>(null)
  const rafId = useRef(0)
  const [dragSun, setDragSun] = useState<SunPos | null>(null)

  const shadowType = shadow?.type ?? 'none'
  const lightType = light ? normalizeLightType(light.type) : 'none'
  const disabled = kind === 'shadow' ? shadowType === 'none' : lightType === 'none'
  const linkFocus = useShadowStore(s => s.linkFocus)
  const linked = linkFocus && shadowType !== 'none' && lightType !== 'none'

  const storeSun =
    kind === 'shadow'
      ? sunFromShadowPosition(shadowType, shadow?.position ?? { x: 0, y: 0 })
      : { x: light?.focus.x ?? 0.55, y: light?.focus.y ?? 0.28 }
  const sun = dragSun ?? storeSun

  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    },
    []
  )

  const flushFocus = () => {
    rafId.current = 0
    const next = pendingFocus.current
    if (!next) return
    applyFocus(next.x, next.y, kind)
  }

  const queueFocus = (next: SunPos) => {
    pendingFocus.current = next
    if (!rafId.current) rafId.current = requestAnimationFrame(flushFocus)
  }

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
    queueFocus(next)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
    if (pendingFocus.current) {
      applyFocus(pendingFocus.current.x, pendingFocus.current.y, kind)
      pendingFocus.current = null
    }
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
