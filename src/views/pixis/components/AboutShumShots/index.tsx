'use client'

import Popup from '@/shared/components/Popup'
import { EMAIL_LINK, GITHUB_LINK, INSPIRATION_LINK, ISSUES_GITHUB_LINK, SHUM_DEV } from '@/shared/constants'
import Button from '@/shared/ui/Button'
import ShumDev from '@/shared/ui/ShumDev'
import ShumShots from '@/shared/ui/ShumShots'
import { Separator } from '@common/ui/Separator'
import Typography from '@common/ui/Typography'
import { CircleHelpIcon, CoffeeIcon, GithubIcon, MailIcon } from 'lucide-react'
import type { FC, ReactNode } from 'react'

const BrandLink = ({
  href,
  label,
  children
}: {
  href: string
  label: string
  children: ReactNode
}) => (
  <Button
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    variant='ghost'
    tooltip={label}
    aria-label={label}
    className='size-auto h-auto rounded-lg p-0 transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]'
  >
    {children}
  </Button>
)

const AboutShumShots: FC = () => {
  return (
    <Popup className='about-popup w-[min(100vw-2rem,340px)]'>
      <Popup.Trigger>
        <Button size='icon' variant='ghost' tooltip='Acerca de PIXIS'>
          <CircleHelpIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Acerca de PIXIS</Popup.Header>

      <Popup.Content className='scrollbar-hidden gap-grid-lg flex flex-col'>
        <Typography.Block title='Desarrollado por:' className='items-center text-center'>
          <div className='flex items-center justify-center gap-3 py-1'>
            <BrandLink href={SHUM_DEV} label='SHUM Dev'>
              <ShumDev size='md' />
            </BrandLink>
            <BrandLink href={GITHUB_LINK} label='PIXIS en GitHub'>
              <ShumShots size='md' />
            </BrandLink>
          </div>
          <Typography.Heading face='display' weight='bold' className='text-lg tracking-wide'>
            SHUM Dev
          </Typography.Heading>
        </Typography.Block>

        <Separator orientation='horizontal' className='opacity-70' />

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
              {' '}
              Shots.so
            </Typography.Link>
            , con la diferencia de que incluye funcionalidades adicionales para desarrolladores y usuarios, permitiéndoles
            capturar y estilizar imágenes directamente desde una fuente de código. Además, es de código abierto.
          </Typography.Paragraph>
        </Typography.Block>

        <Separator orientation='horizontal' className='opacity-70' />

        <Typography.Block title='Feedback y sugerencias:'>
          <Typography.Paragraph tone='secondary'>
            Te invito a dejar tus comentarios y reportar cualquier problema en el repositorio de
            <Typography.Link href={ISSUES_GITHUB_LINK} target='_blank' rel='noopener noreferrer'>
              {' '}
              GitHub
            </Typography.Link>
            . También estaré atento a un contacto más cercano a través de mi correo:
            <Typography.Link href={EMAIL_LINK}> luigmp@gmail.com</Typography.Link>
          </Typography.Paragraph>

          <div className='mt-1 flex flex-wrap gap-2'>
            <Button href={ISSUES_GITHUB_LINK} target='_blank' rel='noopener noreferrer' variant='outline' size='sm'>
              <GithubIcon />
              Issues
            </Button>
            <Button href={EMAIL_LINK} variant='outline' size='sm'>
              <MailIcon />
              Email
            </Button>
          </div>
        </Typography.Block>

        <Typography.Block title='Apoyo al proyecto:'>
          <Typography.Paragraph tone='secondary'>
            Si te gusta PIXIS y deseas apoyar su desarrollo, puedes patrocinar el proyecto donando un café.
          </Typography.Paragraph>
        </Typography.Block>
      </Popup.Content>

      <Popup.Footer className='flex-col items-stretch gap-2'>
        <Button href={SHUM_DEV} target='_blank' rel='noopener noreferrer' status='primary' className='w-full justify-between'>
          <span className='inline-flex items-center gap-2'>
            <CoffeeIcon />
            Invitar un café
          </span>
        </Button>
      </Popup.Footer>
    </Popup>
  )
}

export default AboutShumShots
