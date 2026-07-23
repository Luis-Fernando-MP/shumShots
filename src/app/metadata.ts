import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'PIXIS',
    template: '%s | PIXIS'
  },
  description:
    'PIXIS es un estudio visual para crear snippets de código e imágenes profesionales con fondos, marcos, efectos y exportación de alta calidad.',
  keywords: [
    'PIXIS',
    'code snippets',
    'capturas de código',
    'editor de imágenes',
    'canvas',
    'exportación de imágenes'
  ],
  authors: [{ name: 'Luis MP', url: 'luisjp.vercel.app' }],
  creator: 'Luis MP',
  publisher: 'PIXIS',
  icons: {
    icon: '/logo.webp'
  },
  openGraph: {
    title: 'PIXIS',
    description:
      'Estudio visual para crear snippets de código e imágenes profesionales.',
    siteName: 'PIXIS',
    images: [
      {
        url: '/opengraph.png',
        alt: 'PIXIS Logo',
        width: 1200,
        height: 630
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PIXIS',
    description:
      'Estudio visual para crear snippets de código e imágenes profesionales.',
    images: [
      {
        url: '/opengraph.png',
        alt: 'PIXIS Logo'
      }
    ]
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1
}
