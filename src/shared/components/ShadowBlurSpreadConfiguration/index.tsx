import { ShadowType } from '@views/image-studio/store/shadow/shadow.store'
import { acl } from '@/shared/acl'
import type { FC } from 'react'

interface Props {
  type: ShadowType
  setType: (type: ShadowType) => void
}

const defaultShadows = [
  {
    type: 'none',
    blur: 2,
    spread: 0,
    x: 0,
    y: 0,
    label: 'Limpio'
  },
  {
    type: 'simple',
    blur: 15,
    spread: 0,
    x: 0,
    y: 0,
    label: 'Simple'
  },
  {
    type: 'extended',
    blur: 20,
    spread: 0,
    x: 9,
    y: 9,
    label: 'Extendido'
  },
  {
    type: 'light',
    blur: 3,
    spread: 5,
    x: 0,
    y: 0,
    label: 'Brillo'
  }
]

const ShadowBlurSpreadConfiguration: FC<Props> = ({ type, setType }) => {
  return (
    <section className='flex flex-row flex-wrap items-center gap-2'>
      {defaultShadows.map(shadow => {
        const { type: shdType, blur, spread, x, y, label } = shadow
        const isActive = type === shdType
        return (
          <button
            className={`flex h-[100px] w-[60px] flex-col items-center ${acl(isActive, '[&>div]:border-primary [&>div]:border-2')}`}
            key={shadow.label}
            onClick={() => setType(shdType as ShadowType)}
          >
            <div className='relative size-full overflow-hidden rounded-lg bg-background'>
              <div
                className='absolute left-1/2 top-1/2 size-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background'
                style={{
                  boxShadow: `${x}px ${y}px ${blur}px ${spread}px rgba(var(--fnt-primary), 0.3)`
                }}
              />
            </div>
            <h5>{label}</h5>
          </button>
        )
      })}
    </section>
  )
}

export default ShadowBlurSpreadConfiguration
