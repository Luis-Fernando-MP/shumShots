'use client'

import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import { type ChangeEvent, type InputHTMLAttributes, type JSX, memo, useMemo } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  containerClassName?: string
  label?: string
  /** Valor actual del rango. */
  value: number
  /** Mínimo del rango. @default 0 */
  min?: number
  /** Máximo del rango. @default 100 */
  max?: number
  onChangeRange: (value: number) => void
  displayValue?: string
  unit?: string
}

/**
 * Slider de chrome: pista h-8, radio 12px, label a la izquierda y valor a la derecha dentro del track.
 *
 * @param props.value - Valor actual.
 * @param props.min - Mínimo. Default 0.
 * @param props.max - Máximo. Default 100.
 * @param props.label - Nombre del ajuste, dentro del track.
 * @param props.onChangeRange - Callback al mover el control.
 * @param props.displayValue - Texto del valor. Si se omite, se usa `value` + `unit`.
 * @param props.unit - Sufijo (`px`, `%`, `°`). Default `%` si el rango es 0–100.
 */
const SliderControl = ({
  containerClassName,
  label = '',
  value,
  width,
  onChangeRange,
  className,
  min = 0,
  max = 100,
  step = 1,
  displayValue,
  unit,
  ...props
}: Props): JSX.Element => {
  const minNum = Number(min)
  const maxNum = Number(max)
  const stepNum = Number(step)
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

  const formatted = stepNum < 1 ? String(Math.round(Number(value) * 10) / 10) : String(Math.round(Number(value)))
  const suffix = unit ?? (minNum === 0 && maxNum === 100 ? '%' : '')
  const shown = displayValue ?? `${formatted}${suffix}`

  return (
    <section
      className={cn(
        'relative h-8 min-w-0 w-full overflow-hidden rounded-[12px] bg-muted/60',
        'focus-within:ring-primary/40 focus-within:ring-1',
        containerClassName
      )}
      style={{ width: width ?? '100%' }}
    >
      <div
        className='absolute inset-y-0 left-0 bg-linear-to-r from-foreground/5 to-foreground/15'
        style={{ width: `${percent}%` }}
      />
      <div
        className='bg-foreground/30 pointer-events-none absolute top-0 bottom-0 w-px'
        style={{ left: `${percent}%` }}
      />
      <div className='pointer-events-none relative z-[1] flex h-full items-center justify-between gap-2 px-3'>
        {label && <Text.caption className='min-w-0 truncate text-[11px] font-medium'>{label}</Text.caption>}
        <Text.caption className='ml-auto shrink-0 text-[11px] tabular-nums'>{shown}</Text.caption>
      </div>
      <input
        {...props}
        type='range'
        min={minNum}
        max={maxNum}
        step={stepNum}
        value={value}
        onChange={handleChange}
        aria-label={label || props['aria-label']}
        aria-valuemin={minNum}
        aria-valuemax={maxNum}
        aria-valuenow={Number(value)}
        className={cn('absolute inset-0 z-10 size-full cursor-ew-resize opacity-0', className)}
      />
    </section>
  )
}

export default memo(SliderControl)
