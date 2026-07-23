'use client'

import { ChangeEvent, InputHTMLAttributes, type JSX, memo } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
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
  max = 100,
  ...props
}: Props): JSX.Element => {
  const relativeRadius = ((value / Number(max)) * 100).toFixed(0)

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = Number(target.value)
    onChangeRange(value)
  }

  return (
    <section className={`relative cursor-col-resize overflow-hidden rounded-md py-2 ${containerClassName ?? ''}`} style={{ width: width ?? '100%' }}>
      <input
        {...props}
        type='range'
        className={`absolute inset-0 size-full cursor-col-resize appearance-none bg-primary/20 outline-none [&::-moz-range-thumb]:h-3/5 [&::-moz-range-thumb]:w-[3px] [&::-moz-range-thumb]:cursor-col-resize [&::-moz-range-thumb]:rounded [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground [&::-webkit-slider-thumb]:h-3/5 [&::-webkit-slider-thumb]:w-[3px] [&::-webkit-slider-thumb]:cursor-col-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:bg-foreground ${className ?? ''}`}
        value={value}
        onChange={handleChange}
        max={max}
      />
      <div className='pointer-events-none relative flex size-full select-none flex-row items-center justify-between px-2'>
        <h4 className='text-foreground'>{label}</h4>
        <p className='text-foreground'>{relativeRadius}%</p>
      </div>
    </section>
  )
}

/**
 * @description SliderControl component allows users to select a value from a range.
 * @param containerClassName - Optional class name for the container.
 * @param label - Optional label for the slider.
 * @param value - The current value of the slider.
 * @param onChangeRange - Callback function to handle value changes.
 * @param className - Optional class name for the input element.
 * @param max - Maximum value for the slider (default is 100).
 * @param width - Optional width for the container.
 */

export default memo(SliderControl)
