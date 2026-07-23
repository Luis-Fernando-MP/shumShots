import type { FC } from 'react'

import ShumShots from '../ShumShots'
const NotFound: FC = () => {
  return (
    <section className='flex size-full flex-col items-center justify-center gap-2'>
      <ShumShots size='xl' radius='none' transparent />
      <h1 className='text-7xl'>404</h1>
      <p className='max-w-[200px] text-center'>🤞 Al parecer estas navegando por rutas que no existen.</p>
    </section>
  )
}

export default NotFound
