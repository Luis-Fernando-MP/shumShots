'use client'

import { cn } from '@common/utils/cn'
import useShadowStore, {
  LIGHT_PRESETS,
  resolveLightOverlayStyle,
  resolveLightPreviewFilter,
  type LightType
} from '@views/image-studio/store/shadow/shadow.store'
import { SunIcon, TreePineIcon } from 'lucide-react'
import {
  type CSSProperties,
  type FC,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const SUN_MARGIN = 0.06

const presetBase = (type: LightType) => LIGHT_PRESETS.find(item => item.type === type) ?? LIGHT_PRESETS[0]

const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))

const LightFocusPad: FC = () => {
  const lightType = useShadowStore(s => s.lightType)
  const lightOpacity = useShadowStore(s => s.lightOpacity)
  const lightSize = useShadowStore(s => s.lightSize)
  const lightColor = useShadowStore(s => s.lightColor)
  const lightFocusX = useShadowStore(s => s.lightFocus.x)
  const lightFocusY = useShadowStore(s => s.lightFocus.y)
  const setLightFocus = useShadowStore(s => s.setLightFocus)
  const setLightOpacity = useShadowStore(s => s.setLightOpacity)
  const setLightSize = useShadowStore(s => s.setLightSize)

  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [sun, setSun] = useState({ x: lightFocusX, y: lightFocusY })

  const lightInput = useMemo(
    () => ({
      lightType,
      lightOpacity,
      lightSize,
      lightColor,
      lightFocus: { x: lightFocusX, y: lightFocusY }
    }),
    [lightColor, lightFocusX, lightFocusY, lightOpacity, lightSize, lightType]
  )

  const lightOverlay = useMemo(() => resolveLightOverlayStyle(lightInput), [lightInput])
  const previewFilter = useMemo(() => resolveLightPreviewFilter(lightInput), [lightInput])

  const applyFromSun = useCallback(
    (nx: number, ny: number) => {
      const base = presetBase(lightType)
      if (lightType === 'none') {
        setLightFocus({ x: 0.5, y: 0.35 })
        setLightOpacity(0)
        setLightSize(0)
        return
      }

      const distance = Math.min(1, Math.hypot((nx - 0.5) * 2, (ny - 0.5) * 2))
      let size = base.size
      let opacity = base.opacity

      switch (lightType) {
        case 'soft':
          size = base.size + distance * 10
          opacity = 0.3 + distance * 0.25
          break
        case 'beam':
          size = Math.max(32, base.size - distance * 6)
          opacity = 0.4 + distance * 0.28
          break
        case 'rim':
          size = base.size + distance * 8
          opacity = 0.35 + distance * 0.25
          break
        case 'warm':
          size = base.size + distance * 12
          opacity = 0.34 + distance * 0.26
          break
        default:
          break
      }

      const nextOpacity = Math.min(0.85, opacity)
      const current = useShadowStore.getState()
      if (
        current.lightFocus.x === nx &&
        current.lightFocus.y === ny &&
        current.lightSize === size &&
        current.lightOpacity === nextOpacity
      ) {
        return
      }

      setLightFocus({ x: nx, y: ny })
      setLightSize(size)
      setLightOpacity(nextOpacity)
    },
    [lightType, setLightFocus, setLightOpacity, setLightSize]
  )

  useEffect(() => {
    const focus = useShadowStore.getState().lightFocus
    setSun(focus)
  }, [lightType])

  useEffect(() => {
    applyFromSun(sun.x, sun.y)
  }, [applyFromSun, sun.x, sun.y])

  const moveSun = (event: ReactPointerEvent) => {
    const pad = padRef.current
    if (!pad) return
    const rect = pad.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    setSun({
      x: clamp01((event.clientX - rect.left) / rect.width, SUN_MARGIN),
      y: clamp01((event.clientY - rect.top) / rect.height, SUN_MARGIN)
    })
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (lightType === 'none') return
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveSun(event)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || lightType === 'none') return
    moveSun(event)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const disabled = lightType === 'none'
  const washStyle: CSSProperties | undefined = lightOverlay

  return (
    <SectionBlock title='Foco de luz' description='Arrastra el sol; el arbolito muestra cómo cae la luz.'>
      <div
        ref={padRef}
        className={cn(
          'bg-background relative flex aspect-square w-full touch-none items-center justify-center overflow-hidden rounded-radius ring-1 ring-inset ring-border/50',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-crosshair'
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {washStyle && <div className='pointer-events-none absolute inset-0' style={washStyle} />}

        <div
          className='pointer-events-none relative z-[1] text-foreground/85 [&>svg]:size-20'
          style={{ filter: previewFilter }}
        >
          <TreePineIcon strokeWidth={1.5} />
        </div>

        <div
          className='bg-card text-foreground pointer-events-none absolute z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border shadow-sm'
          style={{ left: `${sun.x * 100}%`, top: `${sun.y * 100}%` }}
        >
          <SunIcon className='size-4' />
        </div>
      </div>
    </SectionBlock>
  )
}

export default LightFocusPad
