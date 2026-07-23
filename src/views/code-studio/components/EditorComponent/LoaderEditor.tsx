import ShumShots from '@/shared/ui/ShumShots'
import type { FC } from 'react'
import { LoaderIcon } from 'react-hot-toast'

const LoaderEditor: FC = () => {
  return (
    <section className='loaderEditor flex h-max w-full flex-col items-center justify-center bg-transparent'>
      <ShumShots size='lg' radius='none' transparent />
      <div className='loaderEditor-wrapper flex flex-row items-center'>
        <LoaderIcon />
        <h3 className='loaderEditor-title xl text-center'>Cargando</h3>
      </div>
    </section>
  )
}

export default LoaderEditor
