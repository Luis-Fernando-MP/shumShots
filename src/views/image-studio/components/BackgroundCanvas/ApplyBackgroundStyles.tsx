import { type FC, RefObject, useCallback, useEffect } from 'react'

import useBackgroundStore from '../../store/background/background.store'
import useBackgroundRadiusStore from '../../store/background/backgroundRadius.store'

interface Props {
  $containerRef: RefObject<HTMLDivElement | null>
}

const ApplyBackgroundStyles: FC<Props> = ({ $containerRef }) => {
  const { backgroundHeight, backgroundWidth, getBackground } = useBackgroundStore()
  const { getStyleBorderRadius } = useBackgroundRadiusStore()

  const backgroundStyle = getBackground()
  const borderRadiusStyle = getStyleBorderRadius()

  const $canvasElements = useCallback(() => {
    console.log('$containerRef', $containerRef)
    const $container = $containerRef.current
    const $editor = document.getElementById('editor') as HTMLDivElement
    if (!$container || !$editor) return

    return { $editor, $container }
  }, [$containerRef])

  useEffect(() => {
    const elements = $canvasElements()

    if (!elements) return
    const { $container, $editor } = elements

    $container.style.height = `${backgroundHeight}px`
    $container.style.width = `${backgroundWidth}px`

    Object.assign($container.style, backgroundStyle)
    Object.assign($container.style, borderRadiusStyle)

    Object.assign($editor.style, borderRadiusStyle)
  }, [$containerRef.current, backgroundStyle, borderRadiusStyle, $canvasElements])

  return null
}

export default ApplyBackgroundStyles
