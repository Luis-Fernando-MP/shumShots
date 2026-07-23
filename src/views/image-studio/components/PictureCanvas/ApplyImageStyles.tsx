import { type FC, RefObject, memo, useCallback, useEffect } from 'react'

import useImagesRadiusStore from '../../store/images/imagesRadius.store'
import useImagesBorderStore from '../../store/images/useImagesBorderStore'
import useShadowStore from '../../store/shadow/shadow.store'

interface Props {
  $containerRef: RefObject<HTMLDivElement | null>
}

const ApplyImageStyles: FC<Props> = ({ $containerRef }) => {
  const { getStyleBorderRadius } = useImagesRadiusStore()
  const { getBorderStyle } = useImagesBorderStore()

  const { borderRadius } = getStyleBorderRadius()
  const borderStyles = getBorderStyle()
  const { getShadowStyle } = useShadowStore()
  const shadowStyle = getShadowStyle()

  const $canvasElements = useCallback(() => {
    const $container = $containerRef?.current
    if (!$container) return null
    const $images: HTMLImageElement[] = Array.from($container.querySelectorAll('div#picture-image'))

    return { $images, $container }
  }, [$containerRef.current])

  useEffect(() => {
    const elements = $canvasElements()
    if (!elements) return
    const { $images } = elements

    $images.forEach(image => {
      Object.assign(image.style, borderStyles)
      image.style.borderRadius = borderRadius
      image.style.boxShadow = shadowStyle
    })
  }, [$canvasElements, borderStyles, borderRadius, shadowStyle])

  return null
}

export default memo(ApplyImageStyles)
