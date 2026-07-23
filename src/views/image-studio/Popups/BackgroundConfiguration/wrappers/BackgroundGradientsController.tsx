import useBackgroundStore from '@views/image-studio/store/background/background.store'
import GradientsController from '@/shared/components/GradientsController'
import type { FC } from 'react'

const BackgroundGradientsController: FC = () => {
  const { background, setBackground, blendMode, setBlendMode } = useBackgroundStore()

  return (
    <section className='bgConfig-section flex flex-col gap-grid-lg'>
      <GradientsController
        background={background}
        setBackground={setBackground}
        blendMode={blendMode}
        setBlendMode={setBlendMode}
      />
    </section>
  )
}

export default BackgroundGradientsController
