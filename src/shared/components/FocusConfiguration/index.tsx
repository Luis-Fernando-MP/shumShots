import { ShadowType } from '@views/image-studio/store/shadow/shadow.store'
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

const defaultShadows = [
  {
    type: 'none',
    blur: 0,
    spread: 0
  },
  {
    type: 'simple',
    blur: 80,
    spread: 8
  },
  {
    type: 'extended',
    blur: 150,
    spread: 50
  },
  {
    type: 'light',
    blur: 50,
    spread: 5
  }
]

const SHADOW_DISPERSION = 10
const MAX_SHADOW_DISTANCE = 70
const SHADOW_SPREAD = 20

const FocusConfiguration: FC<Props> = ({ shadowType, setPosition, setBlur, setSpread, setOpacity }) => {
  const $containerRef = useRef<HTMLDivElement>(null)
  const $sunRef = useRef<HTMLButtonElement>(null)
  const $objectiveRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [sunPositions, setSunPositions] = useState<Positions>({ x: 0, y: 0 })
  const [shadowStyle, setShadowStyle] = useState<string>('none')

  useEffect(() => {
    if (!$containerRef.current || !$sunRef.current) return
    const { width, height } = $containerRef.current.getBoundingClientRect()
    const sunBound = $sunRef.current.getBoundingClientRect()

    const initialX = width - sunBound.width * 2
    const initialY = sunBound.height

    setSunPositions({ x: width - sunBound.width * 2, y: sunBound.height })
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

    const shadowConfig = defaultShadows.find(s => s.type === shadowType) || defaultShadows[0]

    const centerX = containerWidth / 2
    const centerY = containerHeight / 2

    const relX = (x - centerX) / centerX
    const relY = (y - centerY) / centerY

    let shadowX = -relX * MAX_SHADOW_DISTANCE
    let shadowY = -relY * MAX_SHADOW_DISTANCE

    const distance = Math.sqrt(relX * relX + relY * relY)

    let blur, spread, opacity

    switch (shadowType) {
      case 'simple':
        shadowX = -relX * 50
        shadowY = -relY * 50
        blur = shadowConfig.blur
        spread = shadowConfig.spread
        opacity = 0.3 + distance * 0.4
        break
      case 'extended':
        shadowX = -relX * MAX_SHADOW_DISTANCE
        shadowY = -relY * MAX_SHADOW_DISTANCE
        blur = shadowConfig.blur + distance * SHADOW_DISPERSION
        spread = shadowConfig.spread + distance * 5
        opacity = 0.4 + distance * 0.4
        break
      case 'light':
        // La luz no depende tanto de la dirección sino de la distancia
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

    const newShadowStyle = `drop-shadow(${shadowX}px ${shadowY}px ${spread * 0.2}px rgba(var(--fnt-primary), ${opacity.toFixed(2)}))`
    setPosition({ x: shadowX, y: shadowY })
    setBlur(blur)
    setSpread(spread)
    setOpacity(opacity)
    setShadowStyle(newShadowStyle)
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

      const constrainedX = Math.max(0, Math.min(width - sunWidth, newX))
      const constrainedY = Math.max(0, Math.min(height - sunHeight, newY))

      setSunPositions({ x: constrainedX, y: constrainedY })
    })
  }

  return (
    <section
      role='button'
      tabIndex={0}
      className='relative flex size-[280px] items-center justify-center overflow-hidden rounded-lg bg-background'
      ref={$containerRef}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
    >
      <button
        className='z-10 rounded-full bg-muted p-2'
        ref={$sunRef}
        onMouseDown={handleDown}
        style={{
          left: `${sunPositions.x}px`,
          top: `${sunPositions.y}px`,
          position: 'absolute'
        }}
      >
        <SunIcon />
      </button>

      <div
        className='pointer-events-none [&>svg]:size-20'
        ref={$objectiveRef}
        style={{
          filter: shadowStyle
        }}
      >
        <TreePineIcon />
      </div>
    </section>
  )
}

export default FocusConfiguration
