'use client'

import Switch from '@common/components/Switch'
import Typography from '@common/components/Typography'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import type { FC } from 'react'

const ConstrainBuilder: FC = () => {
  const constrainToParent = useLayoutStore(s => s.constrainToParent)
  const setConstrainToParent = useLayoutStore(s => s.setConstrainToParent)

  return (
    <SectionBlock
      title='Relación padre–hijo'
      description='Si está activo, los slots respetan el aspect y caben en el 90% del fondo.'
    >
      <div className='flex items-center justify-between gap-3'>
        <Typography.Small className='text-xs'>Mantener relación con el canvas</Typography.Small>
        <Switch
          on={constrainToParent}
          onChange={() => setConstrainToParent(!constrainToParent)}
          size='sm'
          aria-label='Mantener relación padre-hijo'
        />
      </div>
    </SectionBlock>
  )
}

export default ConstrainBuilder
