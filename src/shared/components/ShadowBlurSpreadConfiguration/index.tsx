import { acl } from '@/shared/acl'
import { SHADOW_PRESETS, type ShadowType } from '@views/image-studio/store/shadow/shadow.store'
import type { FC } from 'react'

interface Props {
  type: ShadowType
  setType: (type: ShadowType) => void
}

/** @deprecated Prefer image-studio ShadowPresetsWrapper. Kept for legacy imports. */
const ShadowBlurSpreadConfiguration: FC<Props> = ({ type, setType }) => {
  return (
    <section className='grid grid-cols-3 gap-2'>
      {SHADOW_PRESETS.map(shadow => {
        const isActive = type === shadow.type
        return (
          <button
            className={`flex flex-col items-center gap-1 ${acl(isActive, '[&>div]:border-primary [&>div]:border-2')}`}
            key={shadow.type}
            type='button'
            onClick={() => setType(shadow.type)}
          >
            <div className='bg-background relative h-16 w-full overflow-hidden rounded-lg'>
              <div
                className='bg-background absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-md'
                style={{ boxShadow: shadow.preview }}
              />
            </div>
            <h5>{shadow.label}</h5>
          </button>
        )
      })}
    </section>
  )
}

export default ShadowBlurSpreadConfiguration
