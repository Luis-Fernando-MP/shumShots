'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import usePortraitStore from '@views/image-studio/Popups/Canvas/Portrait/store/portrait/store'
import { resolveRadialDarken } from '@views/image-studio/utils/backgroundStyle'
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")"

const toLocal = (event: ReactPointerEvent<HTMLElement>, node: HTMLElement) => {
  const rect = node.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100,
    y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100
  }
}

/**
 * Efectos de retrato sobre el shot (exportables) y chrome de anillo (oculto al capturar).
 *
 * @param props.children - Fondo, slots y luz del editor.
 */
const PortraitLayer = ({ children }: { children: ReactNode }) => {
  const mode = usePortraitStore(s => s.mode)
  const focusX = usePortraitStore(s => s.focusX)
  const focusY = usePortraitStore(s => s.focusY)
  const size = usePortraitStore(s => s.size)
  const amount = usePortraitStore(s => s.amount)
  const softness = usePortraitStore(s => s.softness)
  const zoom = usePortraitStore(s => s.zoom)
  const noise = usePortraitStore(s => s.noise)
  const canvasBlur = usePortraitStore(s => s.canvasBlur)
  const setFocus = usePortraitStore(s => s.setFocus)
  const setSize = usePortraitStore(s => s.setSize)

  const rootRef = useRef<HTMLDivElement>(null)
  const dragMode = useRef<'move' | 'resize' | null>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const node = rootRef.current
    if (!node) return
    const sync = () => {
      const rect = node.getBoundingClientRect()
      setBox({ w: rect.width, h: rect.height })
    }
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const hasRing = mode !== 'none'
  const inner = `${size}%`
  const outer = `${Math.min(96, size + 18)}%`
  const blurPx = 4 + (amount / 100) * 18
  const loupeD = (size / 100) * box.w * 1.6
  const focusPxX = (focusX / 100) * box.w
  const focusPxY = (focusY / 100) * box.h

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragMode.current || !rootRef.current) return
    const next = toLocal(event, rootRef.current)
    if (dragMode.current === 'move') {
      setFocus(next.x, next.y)
      return
    }
    const dx = next.x - focusX
    const dy = next.y - focusY
    setSize(Math.hypot(dx, dy) * 1.1)
  }

  const stopDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragMode.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div ref={rootRef} className='relative size-fit'>
      <div
        className='relative size-fit'
        style={{ filter: canvasBlur > 0 ? `blur(${canvasBlur}px)` : undefined }}
      >
        {children}

        {mode === 'stage' && (
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              zIndex: APP_Z_INDEX.canvas.portrait,
              ...resolveRadialDarken({
                at: `${focusX}% ${focusY}%`,
                hole: size,
                falloff: softness,
                color: 'rgb(0, 0, 0)',
                opacity: Math.max(0.12, amount / 100) * 0.85
              })
            }}
          />
        )}

        {mode === 'lensBlur' && (
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              zIndex: APP_Z_INDEX.canvas.portrait,
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`,
              maskImage: `radial-gradient(circle at ${focusX}% ${focusY}%, transparent ${inner}, black ${outer})`,
              WebkitMaskImage: `radial-gradient(circle at ${focusX}% ${focusY}%, transparent ${inner}, black ${outer})`
            }}
          />
        )}

        {mode === 'linearBlur' && (
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              zIndex: APP_Z_INDEX.canvas.portrait,
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`,
              maskImage: `linear-gradient(to right, black 0%, transparent ${Math.max(8, focusX - size / 2)}%, transparent ${Math.min(92, focusX + size / 2)}%, black 100%)`,
              WebkitMaskImage: `linear-gradient(to right, black 0%, transparent ${Math.max(8, focusX - size / 2)}%, transparent ${Math.min(92, focusX + size / 2)}%, black 100%)`
            }}
          />
        )}
      </div>

      {mode === 'magnifier' && box.w > 0 && (
        <div
          className='ring-primary pointer-events-none absolute overflow-hidden rounded-full ring-2'
          aria-hidden
          style={{
            zIndex: APP_Z_INDEX.canvas.portrait,
            width: loupeD,
            height: loupeD,
            left: focusPxX,
            top: focusPxY,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div
            className='absolute top-0 left-0'
            style={{
              width: box.w,
              height: box.h,
              transform: `translate(${loupeD / 2 - focusPxX * zoom}px, ${loupeD / 2 - focusPxY * zoom}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {children}
          </div>
        </div>
      )}

      {noise > 0 && (
        <div
          className='pointer-events-none absolute inset-0 mix-blend-overlay'
          style={{
            zIndex: APP_Z_INDEX.canvas.portrait,
            opacity: noise / 140,
            backgroundImage: NOISE_SVG,
            backgroundSize: '140px 140px'
          }}
        />
      )}

      {hasRing && (
        <div className='pointer-events-none absolute inset-0' style={{ zIndex: APP_Z_INDEX.canvas.portrait + 1 }} data-capture-hide>
          <button
            type='button'
            aria-label='Mover foco'
            className='border-primary pointer-events-auto absolute rounded-full border-2 bg-transparent'
            style={{
              width: `${size * 1.6}%`,
              aspectRatio: '1',
              left: `${focusX}%`,
              top: `${focusY}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'grab'
            }}
            onPointerDown={event => {
              dragMode.current = 'move'
              event.currentTarget.setPointerCapture(event.pointerId)
              if (!rootRef.current) return
              const next = toLocal(event, rootRef.current)
              setFocus(next.x, next.y)
            }}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
          />
          <button
            type='button'
            aria-label='Cambiar tamaño'
            className='bg-primary border-background pointer-events-auto absolute size-3 rounded-full border'
            style={{
              left: `${focusX}%`,
              top: `calc(${focusY}% + ${size * 0.8}%)`,
              transform: 'translate(-50%, -50%)',
              cursor: 'ns-resize'
            }}
            onPointerDown={event => {
              dragMode.current = 'resize'
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
          />
          {mode === 'magnifier' && (
            <span
              className='bg-background/80 text-foreground pointer-events-none absolute rounded-full px-2 py-0.5 text-[10px] font-medium'
              style={{
                left: `${focusX}%`,
                top: `calc(${focusY}% + ${size * 0.55}%)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {zoom.toFixed(1)}x
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default PortraitLayer
