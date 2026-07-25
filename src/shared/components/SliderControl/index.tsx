'use client'

import { cn } from '@common/utils/cn'
import { type ChangeEvent, type InputHTMLAttributes, type JSX, memo, useMemo } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  containerClassName?: string
  label?: string
  value: number
  onChangeRange: (value: number) => void
}

const SliderControl = ({
  containerClassName,
  label = '',
  value,
  width,
  onChangeRange,
  className,
  min = 0,
  max = 100,
  ...props
}: Props): JSX.Element => {
  const minNum = Number(min)
  const maxNum = Number(max)
  const safeMax = maxNum === minNum ? minNum + 1 : maxNum

  const percent = useMemo(() => {
    const raw = ((Number(value) - minNum) / (safeMax - minNum)) * 100
    if (raw < 0) return 0
    if (raw > 100) return 100
    return raw
  }, [value, minNum, safeMax])

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onChangeRange(Number(target.value))
  }

  return (
    <section
      className={cn('relative flex min-w-0 flex-1 flex-col gap-1.5', containerClassName)}
      style={{ width: width ?? '100%' }}
    >
      <div className='flex items-center justify-between px-0.5'>
        {label && <span className='text-muted-foreground text-xs font-medium'>{label}</span>}
        <span className='text-foreground ml-auto text-xs tabular-nums'>{Math.round(percent)}%</span>
      </div>

      <div className='relative h-5 w-full'>
        <div className='bg-muted absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full' />

        <div
          className='from-primary/40 via-primary/80 to-primary absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-linear-to-r'
          style={{ width: `${percent}%` }}
        />

        <div
          className='bg-primary/45 pointer-events-none absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md'
          style={{ left: `${percent}%` }}
        />

        <input
          {...props}
          type='range'
          min={minNum}
          max={maxNum}
          value={value}
          onChange={handleChange}
          className={cn(
            'absolute inset-0 z-10 size-full cursor-pointer appearance-none bg-transparent outline-none',
            '[&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-transparent',
            '[&::-moz-range-track]:h-full [&::-moz-range-track]:bg-transparent',
            '[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-primary/50 [&::-webkit-slider-thumb]:shadow-[0_0_14px_3px]',
            '[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:shadow-primary/50 [&::-moz-range-thumb]:shadow-[0_0_14px_3px]',
            className
          )}
        />
      </div>
    </section>
  )
}

export default memo(SliderControl)
