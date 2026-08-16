'use client'

import Button from '@common/components/Button'
import IconInput from '@common/components/IconInput'
import { LockIcon, UnlockIcon } from 'lucide-react'
import { type FC, useCallback, useState } from 'react'

interface Props {
  width: number
  height: number
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  forceLockAspect?: boolean
}

/**
 * Ancho y alto en una fila, con candado de proporción.
 *
 * @param props.width - Ancho actual en px.
 * @param props.height - Alto actual en px.
 * @param props.setWidth - Actualiza el ancho.
 * @param props.setHeight - Actualiza el alto.
 * @param props.forceLockAspect - Si es true, el candado no se puede abrir.
 */
const SizeController: FC<Props> = ({ width, height, setWidth, setHeight, forceLockAspect = false }) => {
  const [lockAspectRatio, setLockAspectRatio] = useState(forceLockAspect)
  const locked = forceLockAspect || lockAspectRatio
  const aspectRatio = width / Math.max(1, height)

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

  return (
    <section className='flex w-full items-center gap-1.5'>
      <div className='min-w-0 flex-1'>
        <IconInput
          value={width}
          onChange={e => handleWidthChange(Number(e.target.value))}
          type='number'
          label='W'
          step={50}
          min={100}
          max={2000}
          width='100%'
        />
      </div>
      {!forceLockAspect && (
        <Button
          size='icon'
          variant={locked ? 'solid' : 'ghost'}
          isSelected={locked}
          tooltip={locked ? 'Desbloquear relación' : 'Bloquear relación'}
          className='size-8 shrink-0 rounded-[12px]'
          onClick={() => setLockAspectRatio(prev => !prev)}
        >
          {locked ? <LockIcon /> : <UnlockIcon />}
        </Button>
      )}
      <div className='min-w-0 flex-1'>
        <IconInput
          value={height}
          onChange={e => handleHeightChange(Number(e.target.value))}
          type='number'
          label='H'
          step={50}
          min={100}
          max={2000}
          width='100%'
        />
      </div>
    </section>
  )
}

export default SizeController
