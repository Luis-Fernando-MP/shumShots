'use client'

import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import { type ChangeEvent, type InputHTMLAttributes, type JSX, memo, useMemo } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  containerClassName?: string
  label?: string
  value: number
  onChangeRange: (value: number) => void
  displayValue?: string
}

/**
 * Slider fino: etiqueta a la izquierda, valor a la derecha, pista de 4px.
 *
 * @param props.containerClassName - Clases del contenedor.
 * @param props.label - Nombre del ajuste.
 * @param props.value - Valor actual.
 * @param props.onChangeRange - Callback al mover el control.
 * @param props.displayValue - Texto del valor (si se omite, porcentaje).
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
  displayValue,
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

  const shown = displayValue ?? `${Math.round(percent)}%`

  return (
    <section className={cn('flex min-w-0 items-center gap-2', containerClassName)} style={{ width: width ?? '100%' }}>
      {label ? <Text.caption className='w-16 shrink-0 truncate'>{label}</Text.caption> : null}
      <div className='relative h-5 min-w-0 flex-1'>
        <div className='bg-muted absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full' />
        <div
          className='bg-primary absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full'
          style={{ width: `${percent}%` }}
        />
        <div
          className='bg-foreground pointer-events-none absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full'
          style={{ left: `${percent}%` }}
        />
        <input
          {...props}
          type='range'
          min={minNum}
          max={maxNum}
          value={value}
          onChange={handleChange}
          aria-label={label || props['aria-label']}
          className={cn('absolute inset-0 z-10 size-full cursor-pointer opacity-0', className)}
        />
      </div>
      <Text.caption className='w-9 shrink-0 text-right tabular-nums'>{shown}</Text.caption>
    </section>
  )
}

export default memo(SliderControl)
