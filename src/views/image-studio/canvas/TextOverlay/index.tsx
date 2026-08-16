'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { cn } from '@common/utils/cn'
import useTextLayersStore from '@views/image-studio/Popups/CanvasImages/TextLayers/store/text-layers/store'
import { type PointerEvent as ReactPointerEvent, useRef } from 'react'

/**
 * Capas de texto sobre el shot. El recuadro de selección no se exporta.
 */
const TextOverlay = () => {
  const layers = useTextLayersStore(s => s.layers)
  const selectedId = useTextLayersStore(s => s.selectedId)
  const selectLayer = useTextLayersStore(s => s.selectLayer)
  const updateLayer = useTextLayersStore(s => s.updateLayer)
  const rootRef = useRef<HTMLDivElement>(null)
  const drag = useRef<'move' | 'scale' | null>(null)
  const origin = useRef({ size: 42, y: 0 })

  if (layers.length === 0) return null

  const localY = (event: ReactPointerEvent<HTMLElement>) => {
    if (!rootRef.current) return 0
    const rect = rootRef.current.getBoundingClientRect()
    return ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100
  }

  const moveLayer = (event: ReactPointerEvent<HTMLElement>, id: string) => {
    if (drag.current !== 'move' || !rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100
    updateLayer(id, { x: Math.min(96, Math.max(4, x)), y: Math.min(96, Math.max(4, y)) })
  }

  return (
    <div
      ref={rootRef}
      className='pointer-events-none absolute inset-0'
      style={{ zIndex: APP_Z_INDEX.canvas.text }}
    >
      {layers.map(layer => {
        const selected = layer.id === selectedId
        return (
          <div
            key={layer.id}
            className={cn('pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-grab select-none')}
            style={{ left: `${layer.x}%`, top: `${layer.y}%` }}
            onPointerDown={event => {
              selectLayer(layer.id)
              drag.current = 'move'
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
            onPointerMove={event => moveLayer(event, layer.id)}
            onPointerUp={event => {
              drag.current = null
              event.currentTarget.releasePointerCapture(event.pointerId)
            }}
            onPointerCancel={event => {
              drag.current = null
              event.currentTarget.releasePointerCapture(event.pointerId)
            }}
          >
            <p
              className='m-0 whitespace-pre leading-none'
              style={{
                color: layer.color,
                opacity: layer.opacity / 100,
                fontSize: layer.fontSize,
                fontFamily: layer.fontFamily,
                fontWeight: layer.weight,
                letterSpacing: `${layer.tracking}px`,
                textTransform: layer.transform,
                textAlign: layer.align,
                WebkitTextStroke: layer.strokeWidth > 0 ? `${layer.strokeWidth}px ${layer.stroke}` : undefined,
                textShadow: layer.shadowBlur > 0 ? `0 ${layer.shadowY}px ${layer.shadowBlur}px ${layer.shadowColor}` : undefined,
                transform: `rotate(${layer.rotation}deg)`
              }}
            >
              {layer.content}
            </p>
            {selected && (
              <div data-capture-hide className='border-primary pointer-events-none absolute inset-[-8px] rounded-[4px] border border-dashed'>
                <button
                  type='button'
                  aria-label='Escalar texto'
                  className='bg-primary border-background pointer-events-auto absolute -right-1.5 -bottom-1.5 size-3 rounded-full border'
                  onPointerDown={event => {
                    event.stopPropagation()
                    selectLayer(layer.id)
                    drag.current = 'scale'
                    origin.current = { size: layer.fontSize, y: localY(event) }
                    event.currentTarget.setPointerCapture(event.pointerId)
                  }}
                  onPointerMove={event => {
                    if (drag.current !== 'scale') return
                    const delta = localY(event) - origin.current.y
                    updateLayer(layer.id, { fontSize: Math.min(160, Math.max(12, origin.current.size + delta * 2.4)) })
                  }}
                  onPointerUp={event => {
                    drag.current = null
                    event.currentTarget.releasePointerCapture(event.pointerId)
                  }}
                  onPointerCancel={event => {
                    drag.current = null
                    event.currentTarget.releasePointerCapture(event.pointerId)
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TextOverlay
