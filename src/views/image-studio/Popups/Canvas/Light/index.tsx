'use client'

import Separator from '@common/components/Separator'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

/**
 * Panel de iluminación del lienzo.
 *
 * @returns El panel de luz para la sidebar.
 */
const Light: FC = () => {
  const reset = useCanvasLightStore(s => s.reset)

  return (
    <DomainPanel onReset={reset}>
      {SECTIONS.map(({ key, component: Component }, index) => (
        <Fragment key={key}>
          {index > 0 && <Separator orientation='horizontal' />}
          <Component />
        </Fragment>
      ))}
    </DomainPanel>
  )
}

export default Light
