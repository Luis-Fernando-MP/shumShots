import { BoxSizing } from '@views/image-studio/store/images/useImagesBorderStore'
import type { FC } from 'react'

interface Props {
  boxSizing: BoxSizing
  setBoxSizing: (boxSizing: BoxSizing) => void
}

const BoxSizingConfiguration: FC<Props> = ({ boxSizing, setBoxSizing }) => {
  return <div></div>
}

export default BoxSizingConfiguration
