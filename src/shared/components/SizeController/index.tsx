import Button from '@/shared/ui/Button'
import IconInput from '@/shared/ui/IconInput'
import { ProportionsIcon } from 'lucide-react'
import { type FC, useCallback, useMemo, useState } from 'react'

interface Props {
  width: number
  height: number
  setWidth: (width: number) => void
  setHeight: (height: number) => void
}

const SizeController: FC<Props> = ({ width, height, setWidth, setHeight }) => {
  const [lockAspectRatio, setLockAspectRatio] = useState(false)
  const aspectRatio = width / height

  const aspectRatioFraction = useMemo(() => {
    const commonRatios = [
      { ratio: 16 / 9, display: '16:9' },
      { ratio: 4 / 3, display: '4:3' },
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

    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b)
    }

    const a = Math.round(width * 100)
    const b = Math.round(height * 100)
    const divisor = gcd(a, b)

    if (a / divisor > 30 || b / divisor > 30) {
      return aspectRatio.toFixed(2)
    }

    return `${a / divisor}:${b / divisor}`
  }, [width, height, aspectRatio])

  const toggleAspectRatioLock = useCallback(() => {
    setLockAspectRatio(prev => !prev)
  }, [])

  const handleWidthChange = useCallback(
    (newWidth: number) => {
      if (!Number.isFinite(newWidth) || newWidth < 100) return setWidth(100)
      if (!lockAspectRatio) return setWidth(newWidth)

      const newHeight = Math.round(newWidth / aspectRatio)
      setHeight(newHeight)
      setWidth(newWidth)
    },
    [lockAspectRatio, aspectRatio, setWidth, setHeight]
  )

  const handleHeightChange = useCallback(
    (newHeight: number) => {
      if (!Number.isFinite(newHeight) || newHeight < 100) return setHeight(100)
      if (!lockAspectRatio) return setHeight(newHeight)

      const newWidth = Math.round(newHeight * aspectRatio)
      setWidth(newWidth)
      setHeight(newHeight)
    },
    [lockAspectRatio, aspectRatio, setWidth, setHeight]
  )

  return (
    <section className='relative flex size-[300px] aspect-square flex-col rounded-lg bg-background'>
      <Button
        tooltipPosition='right'
        onClick={toggleAspectRatioLock}
        active={lockAspectRatio}
        className='absolute left-2 top-2'
      >
        <ProportionsIcon />
        <h5>{lockAspectRatio ? 'Desbloquear relación' : 'Bloquear relación'}</h5>
      </Button>

      <div
        className='absolute left-1/2 top-[45%] grid max-h-[250px] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-md bg-muted'
        style={{
          width: Math.min(200, Math.max(70, width * 0.1)),
          aspectRatio: aspectRatio
        }}
      >
        <h2>{aspectRatioFraction}</h2>
      </div>

      <div className='absolute bottom-0 left-0 flex w-full flex-row items-center justify-between p-2'>
        <div>
          <h4>Ancho</h4>
          <IconInput
            value={width}
            onChange={e => handleWidthChange(Number(e.target.value))}
            width='70px'
            type='number'
            label='px'
            step={50}
            min={100}
            max={2000}
          />
        </div>

        <div>
          <h4>Alto</h4>
          <IconInput
            value={height}
            onChange={e => handleHeightChange(Number(e.target.value))}
            width='70px'
            type='number'
            label='px'
            step={50}
            min={100}
            max={2000}
          />
        </div>
      </div>
    </section>
  )
}

export default SizeController
