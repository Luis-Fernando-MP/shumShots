'use client'

import { type FC, useRef } from 'react'

import ApplyBackgroundStyles from './ApplyBackgroundStyles'

const BackgroundCanvas: FC = () => {
  const $containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div ref={$containerRef} className='editor-background' />
      <ApplyBackgroundStyles $containerRef={$containerRef} />
    </>
  )
}

export default BackgroundCanvas
