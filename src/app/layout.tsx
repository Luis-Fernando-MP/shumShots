import Offline from '@/shared/components/Offline'
import { bodyFonts } from '@/shared/fonts/page-fonts'
import { Toaster } from '@common/ui/Toast'
import NextTopLoader from 'nextjs-toploader'
import type { JSX, ReactNode } from 'react'

import './globals.css'
import { metadata, viewport } from './metadata'
import Providers from './providers'

interface IRootLayout {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
}

const RootLayout = async ({ children }: IRootLayout): Promise<JSX.Element> => {
  return (
    <html lang='es'>
      <body className={`${bodyFonts} relative overflow-hidden antialiased`}>
        <NextTopLoader color='rgb(var(--tn-primary))' showSpinner={false} />
        <Offline />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
export { metadata, viewport }
