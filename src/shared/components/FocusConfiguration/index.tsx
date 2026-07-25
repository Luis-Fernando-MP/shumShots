import { SHADOW_PRESETS, type ShadowType } from '@views/image-studio/store/shadow/shadow.store'
import { SunIcon, TreePineIcon } from 'lucide-react'
import { type FC, type MouseEvent, useEffect, useRef, useState } from 'react'

type Positions = { x: number; y: number }
interface Props {
  shadowType: ShadowType
  setPosition: (position: Positions) => void
  setBlur: (blur: number) => void
  setSpread: (spread: number) => void
  setOpacity: (opacity: number) => void
}

const SHADOW_DISPERSION = 10
const MAX_SHADOW_DISTANCE = 70
const SHADOW_SPREAD = 20

/** @deprecated Prefer image-studio ShadowFocusPad. Kept for legacy imports. */
const FocusConfiguration: FC<Props> = ({ shadowType, setPosition, setBlur, setSpread, setOpacity }) => {
  const $containerRef = useRef<HTMLDivElement>(null)
  const $sunRef = useRef<HTMLButtonElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [sunPositions, setSunPositions] = useState<Positions>({ x: 0, y: 0 })
  const [shadowStyle, setShadowStyle] = useState<string>('none')

  useEffect(() => {
    if (!$containerRef.current || !$sunRef.current) return
    const { width, height } = $containerRef.current.getBoundingClientRect()
    const sunBound = $sunRef.current.getBoundingClientRect()
    const initialX = width - sunBound.width * 2
    const initialY = sunBound.height
    setSunPositions({ x: initialX, y: initialY })
    calculateShadowFromPositions(initialX, initialY, width, height)
  }, [])

  useEffect(() => {
    if (!$containerRef.current) return
    const { width, height } = $containerRef.current.getBoundingClientRect()
    calculateShadowFromPositions(sunPositions.x, sunPositions.y, width, height)
  }, [sunPositions, shadowType])

  const calculateShadowFromPositions = (x: number, y: number, containerWidth: number, containerHeight: number) => {
    if (!$containerRef.current) return
    if (shadowType === 'none') return setShadowStyle('none')

    const shadowConfig = SHADOW_PRESETS.find(s => s.type === shadowType) || SHADOW_PRESETS[0]
    const centerX = containerWidth / 2
    const centerY = containerHeight / 2
    const relX = (x - centerX) / centerX
    const relY = (y - centerY) / centerY

    let shadowX = -relX * MAX_SHADOW_DISTANCE
    let shadowY = -relY * MAX_SHADOW_DISTANCE
    const distance = Math.sqrt(relX * relX + relY * relY)

    let blur = shadowConfig.blur
    let spread = shadowConfig.spread
    let opacity = shadowConfig.opacity

    switch (shadowType) {
      case 'soft':
        shadowX = -relX * 50
        shadowY = -relY * 50
        opacity = 0.3 + distance * 0.4
        break
      case 'float':
      case 'hard':
        shadowX = -relX * MAX_SHADOW_DISTANCE
        shadowY = -relY * MAX_SHADOW_DISTANCE
        blur = shadowConfig.blur + distance * SHADOW_DISPERSION
        spread = shadowConfig.spread + distance * 5
        opacity = 0.4 + distance * 0.4
        break
      case 'glow':
        shadowX = 0
        shadowY = 0
        blur = shadowConfig.blur + distance
        spread = shadowConfig.spread + distance * SHADOW_SPREAD
        opacity = 0.5 + distance * 0.2
        break
      default:
        blur = 0
        spread = 0
        opacity = 0
    }

    setPosition({ x: shadowX, y: shadowY })
    setBlur(blur)
    setSpread(spread)
    setOpacity(opacity)
    setShadowStyle(
      `drop-shadow(${shadowX}px ${shadowY}px ${spread * 0.2}px rgba(var(--fnt-primary), ${opacity.toFixed(2)}))`
    )
  }

  const handleDown = (e: MouseEvent): void => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleUp = (): void => {
    setIsDragging(false)
  }

  const handleMove = (e: MouseEvent): void => {
    requestAnimationFrame(() => {
      if (!isDragging || !$containerRef.current || !$sunRef.current || !e.buttons) return
      const { width, height, left, top } = $containerRef.current.getBoundingClientRect()
      const sunWidth = $sunRef.current.offsetWidth
      const sunHeight = $sunRef.current.offsetHeight
      const newX = e.clientX - left - sunWidth / 2
      const newY = e.clientY - top - sunHeight / 2
      setSunPositions({
        x: Math.max(0, Math.min(width - sunWidth, newX)),
        y: Math.max(0, Math.min(height - sunHeight, newY))
      })
    })
  }

  return (
    <section
      role='button'
      tabIndex={0}
      className='bg-background relative flex size-[280px] items-center justify-center overflow-hidden rounded-lg'
      ref={$containerRef}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
    >
      <button
        className='bg-muted z-10 rounded-full p-2'
        ref={$sunRef}
        type='button'
        onMouseDown={handleDown}
        style={{ left: `${sunPositions.x}px`, top: `${sunPositions.y}px`, position: 'absolute' }}
      >
        <SunIcon />
      </button>

      <div className='pointer-events-none [&>svg]:size-20' style={{ filter: shadowStyle }}>
        <TreePineIcon />
      </div>
    </section>
  )
}

export default FocusConfiguration
