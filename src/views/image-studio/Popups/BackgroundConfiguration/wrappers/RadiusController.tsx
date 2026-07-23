import useBackgroundRadiusStore from '@views/image-studio/store/background/backgroundRadius.store'
import BorderRadiusConfiguration from '@/shared/components/BorderRadiusConfiguration'
import { FC } from 'react'
import Typography from '@common/ui/Typography'

const RadiusController: FC = () => {
  const borderStore = useBackgroundRadiusStore()
  return (
    <Typography.Block title='Redondeado:' className='bgConfig-section flex flex-col gap-grid-lg'>
      <BorderRadiusConfiguration borderState={borderStore} />
    </Typography.Block>
  )
}

export default RadiusController
