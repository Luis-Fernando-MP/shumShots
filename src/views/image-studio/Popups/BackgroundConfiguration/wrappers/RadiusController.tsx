'use client'

import BorderRadiusConfiguration from '@/shared/components/BorderRadiusConfiguration'
import useBackgroundRadiusStore from '@views/image-studio/store/background/backgroundRadius.store'
import type { FC } from 'react'

import SectionBlock from './SectionBlock'

const RadiusController: FC = () => {
  const borderStore = useBackgroundRadiusStore()

  return (
    <SectionBlock title='Redondeado' description='Suaviza las esquinas del lienzo del shot.'>
      <BorderRadiusConfiguration borderState={borderStore} />
    </SectionBlock>
  )
}

export default RadiusController
