'use client'

import Logo from '@common/assets/Logo'
import { type FC } from 'react'

const LoaderPage: FC = () => {
  return (
    <section className='fixed inset-0 z-[9999] grid place-content-center gap-3 bg-background text-foreground'>
      <h2 className='text-center text-xl font-semibold tracking-wide'>PIXIS</h2>
      <Logo className='mx-auto size-16' />
      <p className='text-center text-sm text-muted-foreground'>Cargando…</p>
    </section>
  )
}

export default LoaderPage
