import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import GradientsController from '@/shared/components/GradientsController'
import type { FC } from 'react'

const BorderGradientsController: FC = () => {
  const { gradient, setGradient, blendMode, setBlendMode, setType } = UseImagesBorderStore()

  return (
    <section className='borderConfig-section flex flex-col gap-grid-lg'>
      <GradientsController
        background={gradient}
        setBackground={bg => {
          console.log('setColor', bg)
          setGradient(bg)
          setType('gradient')
        }}
        blendMode={blendMode}
        setBlendMode={setBlendMode}
      />
    </section>
  )
}

export default BorderGradientsController
