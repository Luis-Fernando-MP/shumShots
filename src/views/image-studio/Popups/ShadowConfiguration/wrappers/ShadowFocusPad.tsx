'use client'

import { cn } from '@common/utils/cn'
import useShadowStore, {
  SHADOW_PRESETS,
  resolveDropShadowFilter,
  type ShadowType
} from '@views/image-studio/store/shadow/shadow.store'
import { SunIcon, TreePineIcon } from 'lucide-react'
import {
  type FC,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const MAX_DISTANCE = 70
const SUN_MARGIN = 0.06

const presetBase = (type: ShadowType) => SHADOW_PRESETS.find(item => item.type === type) ?? SHADOW_PRESETS[0]

const clamp01 = (value: number, margin = 0) => Math.min(1 - margin, Math.max(margin, value))

const ShadowFocusPad: FC = () => {
  const type = useShadowStore(s => s.type)
  const opacity = useShadowStore(s => s.opacity)
  const blur = useShadowStore(s => s.blur)
  const spread = useShadowStore(s => s.spread)
  const color = useShadowStore(s => s.color)
  const positionX = useShadowStore(s => s.position.x)
  const positionY = useShadowStore(s => s.position.y)
  const setPosition = useShadowStore(s => s.setPosition)
  const setBlur = useShadowStore(s => s.setBlur)
  const setSpread = useShadowStore(s => s.setSpread)
  const setOpacity = useShadowStore(s => s.setOpacity)

  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [sun, setSun] = useState({ x: 0.78, y: 0.2 })

  const previewFilter = useMemo(
    () =>
      resolveDropShadowFilter({
        type,
        opacity,
        blur,
        spread,
        color,
        position: { x: positionX, y: positionY }
      }),
    [blur, color, opacity, positionX, positionY, spread, type]
  )

  const applyFromSun = useCallback(
    (nx: number, ny: number) => {
      const base = presetBase(type)
      if (type === 'none') {
        setPosition({ x: 0, y: 0 })
        setBlur(0)
        setSpread(0)
        setOpacity(0)
        return
      }

      const relX = (nx - 0.5) * 2
      const relY = (ny - 0.5) * 2
      const distance = Math.min(1, Math.hypot(relX, relY))

      let shadowX = -relX * MAX_DISTANCE
      let shadowY = -relY * MAX_DISTANCE
      let nextBlur = base.blur
      let nextSpread = base.spread
      let nextOpacity = base.opacity

      switch (type) {
        case 'soft':
          shadowX = -relX * 42
          shadowY = -relY * 42
          nextOpacity = 0.28 + distance * 0.28
          nextBlur = base.blur + distance * 8
          break
        case 'hard':
          shadowX = -relX * 28
          shadowY = -relY * 28
          nextOpacity = 0.36 + distance * 0.28
          nextBlur = Math.max(8, base.blur - distance * 4)
          break
        case 'float':
          shadowX = -relX * MAX_DISTANCE
          shadowY = -relY * MAX_DISTANCE
          nextBlur = base.blur + distance * 12
          nextSpread = base.spread + distance * 4
          nextOpacity = 0.3 + distance * 0.3
          break
        case 'glow':
          shadowX = -relX * 8
          shadowY = -relY * 8
          nextBlur = base.blur + distance * 18
          nextSpread = base.spread + distance * 8
          nextOpacity = 0.38 + distance * 0.22
          break
        default:
          break
      }

      nextOpacity = Math.min(0.85, nextOpacity)
      const current = useShadowStore.getState()
      if (
        current.position.x === shadowX &&
        current.position.y === shadowY &&
        current.blur === nextBlur &&
        current.spread === nextSpread &&
        current.opacity === nextOpacity
      ) {
        return
      }

      setPosition({ x: shadowX, y: shadowY })
      setBlur(nextBlur)
      setSpread(nextSpread)
      setOpacity(nextOpacity)
    },
    [setBlur, setOpacity, setPosition, setSpread, type]
  )

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
    if (type === 'none') return
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveSun(event)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || type === 'none') return
    moveSun(event)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const disabled = type === 'none'

  return (
    <SectionBlock title='Foco' description='Arrastra el sol para dirigir la sombra sobre el arbolito.'>
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
        <div className='pointer-events-none text-foreground/80 [&>svg]:size-20' style={{ filter: previewFilter }}>
          <TreePineIcon strokeWidth={1.5} />
        </div>

        <div
          className='bg-muted text-foreground pointer-events-none absolute z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full'
          style={{ left: `${sun.x * 100}%`, top: `${sun.y * 100}%` }}
        >
          <SunIcon className='size-4' />
        </div>
      </div>
    </SectionBlock>
  )
}

export default ShadowFocusPad
