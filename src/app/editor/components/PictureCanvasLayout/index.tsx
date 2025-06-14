import { key } from '@/shared/key';
import { type FC, useMemo, useRef } from 'react';



import useImagesLayoutStore from '../../store/images/imagesLayout.store';
import usePicturesStore from '../../store/images/pictures.store';
import PictureMemo from '../PictureCanvas';
import ApplyImageStyles from './ApplyImageStyles';
import './style.scss';





const transformImageForLayout = {
  default: ['translate(-50%, -50%)', 'translate(-45%, -45%) rotate(-10deg)', 'translate(-60%, -45%) rotate(10deg)'],
  rose: [
    'translate(-50%, -50%) rotate(0deg)',
    'translate(-40%, -40%) rotate(45deg)',
    'translate(-30%, -30%) rotate(90deg)',
    'translate(-20%, -20%) rotate(135deg)',
    'translate(-10%, -10%) rotate(180deg)'
  ],
  grid: [
    'translate(-90%, -30%) rotate(-10deg) scale(0.8)',
    'translate(100px, 0)',
    'translate(200px, 0)',
    'translate(0, 100px)',
    'translate(100px, 100px)',
    'translate(200px, 100px)'
  ],
  circle: [
    'translate(-50%, -50%) rotate(0deg)',
    'translate(-40%, -40%) rotate(45deg)',
    'translate(-30%, -30%) rotate(90deg)',
    'translate(-20%, -20%) rotate(135deg)',
    'translate(-10%, -10%) rotate(180deg)',
    'translate(0%, 0%) rotate(225deg)',
    'translate(10%, 10%) rotate(270deg)',
    'translate(20%, 20%) rotate(315deg)'
  ]
}

const PictureCanvasLayout: FC = () => {
  const { pictures, addPicture } = usePicturesStore()
  const currentLayout = useImagesLayoutStore(s => s.currentLayout)
  const layoutCounter = useImagesLayoutStore(s => s.layoutCounter)

  const $layoutRef = useRef<HTMLElement>(null)

  const render = useMemo(() => {
    const transform = transformImageForLayout[currentLayout]

    return Array.from({ length: layoutCounter }, (_, i) => {
      const picture = pictures[layoutCounter - (i + 1)] ?? { key: key('black id', i), url: null }
      return <PictureMemo key={picture.key} image={picture.url} addPicture={addPicture} transform={transform[i]} />
    })
  }, [pictures, layoutCounter, currentLayout, addPicture])

  return (
    <article ref={$layoutRef} className={`canvasLayout ${currentLayout}`}>
      <ApplyImageStyles $layoutRef={$layoutRef} />
      {render}
    </article>
  )
}

export default PictureCanvasLayout