'use client'

import Popup from '@/shared/components/Popup'
import { EMAIL_LINK, GITHUB_LINK, INSPIRATION_LINK, ISSUES_GITHUB_LINK, SHUM_DEV } from '@/shared/constants'
import Button from '@/shared/ui/Button'
import ShumDev from '@/shared/ui/ShumDev'
import ShumShots from '@/shared/ui/ShumShots'
import Typography from '@common/ui/Typography'
import { CircleHelpIcon } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'

const AboutShumShots: FC = () => {
  return (
    <Popup className='about-popup max-w-[300px]'>
      <Popup.Trigger>
        <Button size='icon' variant='ghost' tooltip='Acerca de PIXIS'>
          <CircleHelpIcon />
        </Button>
      </Popup.Trigger>
      <Popup.Header>Acerca de PIXIS</Popup.Header>
      <Popup.Content className='scrollbar-hidden gap-grid-lg flex flex-col'>
        <Typography.Block title='Desarrollado por:'>
          <Typography.Heading face='display' weight='bold' className='text-lg'>
            SHUM Dev
          </Typography.Heading>
        </Typography.Block>

        <div className='flex items-center justify-center gap-3'>
          <Link href={SHUM_DEV} target='_blank' rel='noopener noreferrer' aria-label='SHUM Dev'>
            <ShumDev size='lg' />
          </Link>
          <Link href={GITHUB_LINK} target='_blank' rel='noopener noreferrer' aria-label='PIXIS en GitHub'>
            <ShumShots size='lg' />
          </Link>
        </div>

        <Typography.Block title='Descripción:'>
          <Typography.Paragraph tone='secondary'>
            PIXIS es un estudio visual para crear snippets de código e imágenes profesionales con presets, fondos y exportación de
            alta calidad.
          </Typography.Paragraph>
        </Typography.Block>

        <Typography.Block title='Inspiración:'>
          <Typography.Paragraph tone='secondary'>
            PIXIS toma inspiración de
            <Typography.Link href={INSPIRATION_LINK} target='_blank' rel='noopener noreferrer'>
              &nbsp;Shots.so
            </Typography.Link>
            , con la diferencia de que incluye funcionalidades adicionales para desarrolladores y usuarios, permitiéndoles
            capturar y estilizar imágenes directamente desde una fuente de código. Además, es de código abierto.
          </Typography.Paragraph>
        </Typography.Block>

        <Typography.Block title='Feedback y sugerencias:'>
          <Typography.Paragraph tone='secondary'>
            Te invito a dejar tus comentarios y reportar cualquier problema en el repositorio de
            <Typography.Link href={ISSUES_GITHUB_LINK} target='_blank' rel='noopener noreferrer'>
              &nbsp;GitHub 🐛
            </Typography.Link>
            . También estaré atento a un contacto más cercano a través de mi correo:
            <Typography.Link href={EMAIL_LINK}>&nbsp;luigmp@gmail.com</Typography.Link>
          </Typography.Paragraph>
        </Typography.Block>

        <Typography.Block title='Apoyo al proyecto:'>
          <Typography.Paragraph tone='secondary'>
            Si te gusta PIXIS y deseas apoyar su desarrollo, puedes patrocinar el proyecto donando un café ❤️☕.
          </Typography.Paragraph>
        </Typography.Block>
      </Popup.Content>
    </Popup>
  )
}

export default AboutShumShots
