'use client'

import SwitchRow from '@views/image-studio/Popups/common/components/SwitchRow'
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
      <SwitchRow
        on={constrainToParent}
        onChange={() => setConstrainToParent(!constrainToParent)}
        ariaLabel='Mantener relación padre-hijo'
      />
    </SectionBlock>
  )
}

export default ConstrainBuilder
