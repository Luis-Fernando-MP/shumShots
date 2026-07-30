'use client'

import { cn } from '@common/utils/cn'
import {
  LIGHT_DATA,
  LIGHT_PRESETS,
  normalizeLightType,
  resolveLightOverlayStyle
} from '@views/image-studio/Popups/common/presets/light'
import { defaultLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/initialState'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { CanvasLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { SunIcon } from 'lucide-react'
import { type FC, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react'

type SunPos = { x: number; y: number }

const SUN_MARGIN = 0.06
const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))
const nearlySame = (a: SunPos, b: SunPos) => Math.abs(a.x - b.x) < 1e-4 && Math.abs(a.y - b.y) < 1e-4
const round1 = (value: number) => Math.round(value * 10) / 10

const selectActiveLight = (s: { layers: CanvasLightLayer[]; activeId: string }) =>
  s.layers.find(layer => layer.id === s.activeId) ?? s.layers[0] ?? defaultLightLayer(1)

const FocusPad: FC = () => {
  const light = useCanvasLightStore(selectActiveLight)
  const updateLight = useCanvasLightStore(s => s.updateLight)
  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pendingFocus = useRef<SunPos | null>(null)
  const rafId = useRef(0)
  const [dragSun, setDragSun] = useState<SunPos | null>(null)

  const lightType = normalizeLightType(light.type)
  const disabled = lightType === 'none'
  const storeSun = { x: light.focus.x, y: light.focus.y }
  const sun = dragSun ?? storeSun

  const lightOverlay = resolveLightOverlayStyle({
    lightType: light.type,
    lightOpacity: light.opacity,
    lightSize: light.size,
    lightColor: light.color,
    lightFocus: light.focus
  })

  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    },
    []
  )

  const applyFocus = (nx: number, ny: number) => {
    if (disabled) return
    const base = LIGHT_PRESETS.find(item => item.type === lightType) ?? LIGHT_PRESETS[0]
    const pad = LIGHT_DATA[lightType].pad
    const distance = Math.min(1, Math.hypot((nx - 0.5) * 2, (ny - 0.5) * 2))
    let size = base.size + distance * pad.sizeGrow
    if ('sizeMin' in pad && typeof pad.sizeMin === 'number') {
      size = Math.max(pad.sizeMin, size)
    }
    size = round1(size)
    const focus = { x: round1(nx * 1000) / 1000, y: round1(ny * 1000) / 1000 }
    updateLight({ focus, size })
  }

  const flushFocus = () => {
    rafId.current = 0
    const next = pendingFocus.current
    if (!next) return
    applyFocus(next.x, next.y)
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
      applyFocus(pendingFocus.current.x, pendingFocus.current.y)
      pendingFocus.current = null
    }
    setDragSun(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <SectionBlock title='Foco' level={2} description='Mueve el sol para dirigir la luz del canvas.'>
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
        {lightOverlay && <div className='pointer-events-none absolute inset-0' style={lightOverlay} />}
        <div className='bg-primary/45 pointer-events-none relative z-[1] size-14 rounded-md' />
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
