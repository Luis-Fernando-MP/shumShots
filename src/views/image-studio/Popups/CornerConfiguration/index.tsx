'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import useImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import useImagesRadiusStore from '@views/image-studio/store/images/imagesRadius.store'
import { SquareRoundCornerIcon } from 'lucide-react'
import { type FC } from 'react'

import BorderColorsController from './wrappers/BorderColorsController'
import BorderMatController from './wrappers/BorderMatController'
import BorderSizeController from './wrappers/BorderSizeController'
import BorderStyleController from './wrappers/BorderStyleController'
import ImagesRadiusController from './wrappers/ImagesRadiusController'

const CornerConfiguration: FC = () => {
  const resetBorder = useImagesBorderStore(s => s.resetBorder)

  const handleReset = () => {
    resetBorder()
    useImagesRadiusStore.setState({
      activeIndividualBorder: false,
      borderLTRadius: 20,
      borderRTRadius: 20,
      borderLBRadius: 20,
      borderRBRadius: 20,
      borderRadius: 20,
      borderSmooth: 0
    })
  }

  return (
    <Popup className='h-[760px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Bordes de la imagen'>
          <SquareRoundCornerIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>Imagen · Bordes</h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'>
        <ImagesRadiusController />
        <BorderStyleController />
        <BorderColorsController />
        <BorderMatController />
        <BorderSizeController />
      </Popup.Content>

      <Popup.Footer>
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={handleReset}>
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default CornerConfiguration
