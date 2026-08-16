'use client'

import Button from '@common/components/Button'
import IconInput from '@common/components/IconInput'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import { LockIcon, UnlockIcon } from 'lucide-react'
import { type FC, useCallback, useMemo, useState } from 'react'

interface Props {
  width: number
  height: number
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  forceLockAspect?: boolean
}

const SizeController: FC<Props> = ({ width, height, setWidth, setHeight, forceLockAspect = false }) => {
  const [lockAspectRatio, setLockAspectRatio] = useState(forceLockAspect)
  const locked = forceLockAspect || lockAspectRatio
  const aspectRatio = width / Math.max(1, height)

  const aspectRatioFraction = useMemo(() => {
    const commonRatios = [
      { ratio: 16 / 9, display: '16:9' },
      { ratio: 4 / 3, display: '4:3' },
      { ratio: 3 / 4, display: '3:4' },
      { ratio: 3 / 2, display: '3:2' },
      { ratio: 1, display: '1:1' },
      { ratio: 9 / 16, display: '9:16' },
      { ratio: 2 / 3, display: '2:3' },
      { ratio: 21 / 9, display: '21:9' },
      { ratio: 5 / 4, display: '5:4' }
    ]

    let closest = commonRatios[0]
    let minDiff = Math.abs(aspectRatio - closest.ratio)

    for (let i = 1; i < commonRatios.length; i++) {
      const diff = Math.abs(aspectRatio - commonRatios[i].ratio)
      if (diff < minDiff) {
        minDiff = diff
        closest = commonRatios[i]
      }
    }

    if (minDiff < 0.01) return closest.display

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const a = Math.round(width * 100)
    const b = Math.round(height * 100)
    const divisor = gcd(a, b)
    if (a / divisor > 30 || b / divisor > 30) return aspectRatio.toFixed(2)
    return `${a / divisor}:${b / divisor}`
  }, [width, height, aspectRatio])

  const handleWidthChange = useCallback(
    (newWidth: number) => {
      if (!Number.isFinite(newWidth) || newWidth < 100) return setWidth(100)
      if (!locked) return setWidth(newWidth)
      setHeight(Math.round(newWidth / aspectRatio))
      setWidth(newWidth)
    },
    [locked, aspectRatio, setWidth, setHeight]
  )

  const handleHeightChange = useCallback(
    (newHeight: number) => {
      if (!Number.isFinite(newHeight) || newHeight < 100) return setHeight(100)
      if (!locked) return setHeight(newHeight)
      setWidth(Math.round(newHeight * aspectRatio))
      setHeight(newHeight)
    },
    [locked, aspectRatio, setWidth, setHeight]
  )

  const landscape = aspectRatio >= 1

  return (
    <section className='flex w-full flex-col gap-3'>
      <div className='border-border/60 bg-muted/40 relative aspect-square w-full overflow-hidden rounded-[12px] border'>
        <Text.caption className='text-muted-foreground/80 absolute top-2 left-3 tabular-nums'>{width} px</Text.caption>
        <Text.caption className='text-muted-foreground/80 absolute top-1/2 right-2 -translate-y-1/2 tabular-nums [writing-mode:vertical-rl]'>
          {height} px
        </Text.caption>

        {!forceLockAspect && (
          <Button
            size='icon'
            variant={locked ? 'solid' : 'ghost'}
            isSelected={locked}
            tooltip={locked ? 'Desbloquear relación' : 'Bloquear relación'}
            className='absolute top-1.5 right-1.5 size-8 rounded-[12px]'
            onClick={() => setLockAspectRatio(prev => !prev)}
          >
            {locked ? <LockIcon /> : <UnlockIcon />}
          </Button>
        )}

        <div className='absolute inset-0 grid place-content-center'>
          <div
            className='border-border bg-card grid place-content-center rounded-[8px] border shadow-sm'
            style={{
              aspectRatio,
              width: landscape ? '58%' : undefined,
              height: landscape ? undefined : '58%'
            }}
          >
            <Text.emphasis className='tabular-nums'>{aspectRatioFraction}</Text.emphasis>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <label className='flex min-w-0 flex-col gap-1'>
          <Text.caption>Ancho</Text.caption>
          <IconInput
            value={width}
            onChange={e => handleWidthChange(Number(e.target.value))}
            type='number'
            label='px'
            step={50}
            min={100}
            max={2000}
            width='100%'
          />
        </label>
        <label className='flex min-w-0 flex-col gap-1'>
          <Text.caption>Alto</Text.caption>
          <IconInput
            value={height}
            onChange={e => handleHeightChange(Number(e.target.value))}
            type='number'
            label='px'
            step={50}
            min={100}
            max={2000}
            width='100%'
          />
        </label>
      </div>
    </section>
  )
}

export default SizeController
