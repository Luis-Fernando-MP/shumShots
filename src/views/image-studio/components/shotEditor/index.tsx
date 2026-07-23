import { FC, memo } from 'react'

import BackgroundCanvas from '../../components/BackgroundCanvas'
import PictureCanvas from '../PictureCanvas'

const ShotEditor: FC = () => {
  return (
    <div className='relative size-fit overflow-hidden rounded-radius' id='editor'>
      <BackgroundCanvas />
      <PictureCanvas />
    </div>
  )
}

export default memo(ShotEditor)
