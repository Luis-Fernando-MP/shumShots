'use client'

import { cn } from '@common/utils/cn'
import type { FC } from 'react'

export type MiniBoxesPattern = 'grid' | 'stagger' | 'stack' | 'fan' | 'diagonal' | 'column' | 'orbit'

type Props = {
  active?: boolean
  count: number
  pattern: MiniBoxesPattern
}

const MiniBoxes: FC<Props> = ({ active, count, pattern }) => {
  const fill = cn(active ? 'bg-primary' : 'bg-foreground/30')
  const n = Math.max(1, Math.min(5, count))

  if (pattern === 'stagger') {
    return (
      <div className='relative h-10 w-full'>
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            className={cn('absolute h-[36%] rounded-[2px]', fill)}
            style={{
              width: `${Math.min(42, 70 / n)}%`,
              left: `${8 + i * ((84 - Math.min(42, 70 / n)) / Math.max(1, n - 1))}%`,
              top: `${10 + (i % 2) * 28}%`
            }}
          />
        ))}
      </div>
    )
  }

  if (pattern === 'stack') {
    return (
      <div className='relative h-10 w-full'>
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            className={cn('absolute h-[48%] w-[48%] rounded-[2px]', fill)}
            style={{
              left: `${18 + i * 8}%`,
              top: `${14 + i * 8}%`,
              opacity: 0.55 + (i / Math.max(1, n - 1)) * 0.45
            }}
          />
        ))}
      </div>
    )
  }

  if (pattern === 'fan') {
    const mid = (n - 1) / 2
    return (
      <div className='relative h-10 w-full'>
        {Array.from({ length: n }, (_, i) => {
          const delta = i - mid
          return (
            <div
              key={i}
              className={cn('absolute top-[20%] h-[48%] origin-bottom rounded-[2px]', fill)}
              style={{
                width: `${Math.min(44, 80 / n)}%`,
                left: `${16 + i * (48 / Math.max(1, n))}%`,
                transform: `rotate(${delta * 10}deg)`,
                opacity: 0.6 + (1 - Math.abs(delta) / Math.max(1, mid)) * 0.4
              }}
            />
          )
        })}
      </div>
    )
  }

  if (pattern === 'diagonal') {
    return (
      <div className='relative h-10 w-full'>
        {Array.from({ length: n }, (_, i) => {
          const t = n <= 1 ? 0.5 : i / (n - 1)
          return (
            <div
              key={i}
              className={cn('absolute h-[34%] w-[34%] rounded-[2px]', fill)}
              style={{
                left: `${8 + t * 50}%`,
                top: `${8 + (1 - t) * 48}%`
              }}
            />
          )
        })}
      </div>
    )
  }

  if (pattern === 'column') {
    const h = Math.min(28, 70 / n)
    return (
      <div className='relative h-10 w-full'>
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            className={cn('absolute left-[30%] w-[40%] rounded-[2px]', fill)}
            style={{
              height: `${h}%`,
              top: `${8 + i * ((84 - h) / Math.max(1, n - 1 || 1))}%`
            }}
          />
        ))}
      </div>
    )
  }

  if (pattern === 'orbit') {
    return (
      <div className='relative h-10 w-full'>
        {Array.from({ length: n }, (_, i) => {
          const angle = n <= 1 ? -Math.PI / 2 : (i / n) * Math.PI * 2 - Math.PI / 2
          const cx = 50
          const cy = 50
          const rx = 28
          const ry = 22
          return (
            <div
              key={i}
              className={cn('absolute h-[28%] w-[24%] rounded-[2px]', fill)}
              style={{
                left: `${cx + Math.cos(angle) * rx - 12}%`,
                top: `${cy + Math.sin(angle) * ry - 14}%`,
                opacity: 0.65 + (i / Math.max(1, n - 1)) * 0.35
              }}
            />
          )
        })}
      </div>
    )
  }

  // grid
  const cols = n <= 3 ? n : n === 4 ? 2 : 3
  const rows = Math.ceil(n / cols)
  const cellW = Math.min(40, 78 / cols)
  const cellH = Math.min(40, 78 / rows)

  return (
    <div className='relative h-10 w-full'>
      {Array.from({ length: n }, (_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return (
          <div
            key={i}
            className={cn('absolute rounded-[2px]', fill)}
            style={{
              width: `${cellW}%`,
              height: `${cellH}%`,
              left: `${11 + col * ((78 - cellW) / Math.max(1, cols - 1 || 1))}%`,
              top: `${11 + row * ((78 - cellH) / Math.max(1, rows - 1 || 1))}%`
            }}
          />
        )
      })}
    </div>
  )
}

export default MiniBoxes
