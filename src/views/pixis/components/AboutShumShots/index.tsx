'use client'

import Popup from '@/shared/components/Popup'
import { EMAIL_LINK, GITHUB_LINK, INSPIRATION_LINK, ISSUES_GITHUB_LINK, SHUM_DEV } from '@/shared/constants'
import IconButton from '@/shared/ui/IconButton'
import ShumDev from '@/shared/ui/ShumDev'
import ShumShots from '@/shared/ui/ShumShots'
import { CircleHelpIcon } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'

const AboutShumShots: FC = () => {
  return (
    <Popup title='Acerca de PIXIS' className='about-popup flex max-w-[300px] flex-col gap-grid-lg'>
      <Popup.Trigger>
        <IconButton label='Acerca de PIXIS' transparent>
          <CircleHelpIcon />
        </IconButton>
      </Popup.Trigger>
      <div className='paragraph'>
        <h4 className='paragraph-normal'>#Desarrolla por: </h4>
        <h3 className='paragraph-highlight'>
          <b>SHUM Dev</b>
        </h3>
      </div>

      <div className='about-brands flex items-center justify-center'>
        <Link href={SHUM_DEV} target='_blank' rel='noopener noreferrer'>
          <ShumDev size='lg' />
        </Link>
        <Link href={GITHUB_LINK} target='_blank' rel='noopener noreferrer'>
          <ShumShots size='lg' />
        </Link>
      </div>

      <div className='paragraph'>
        <h3 className='paragraph-highlight'>#Descripción:</h3>
        <p className='paragraph-break'>
          PIXIS es un estudio visual para crear snippets de código e imágenes profesionales con presets, fondos y
          exportación de alta calidad.
        </p>
      </div>

      <div className='paragraph'>
        <h3 className='paragraph-highlight'>#Inspiración:</h3>
        <p className='paragraph-break'>
          PIXIS toma inspiración de:
          <Link href={INSPIRATION_LINK} target='_blank' rel='noopener noreferrer' className='paragraph-link'>
            &nbsp;Shots.so
          </Link>
          , con la diferencia de que incluye funcionalidades adicionales para desarrolladores y usuarios, permitiéndoles
          capturar y estilizar imágenes directamente desde una fuente de código Además, es de código abierto.
        </p>
      </div>

      <div className='paragraph'>
        <h3 className='paragraph-highlight'>#Feedback y Sugerencias:</h3>
        <p className='paragraph-break'>
          Te invito a dejar tus comentarios y reportar cualquier problema en el repositorio de
          <Link href={ISSUES_GITHUB_LINK} target='_blank' rel='noopener noreferrer' className='paragraph-link'>
            &nbsp;GitHub 🐛
          </Link>
          . También estaré atento a un contacto más cercano a través de mi correo:
          <Link href={EMAIL_LINK} className='paragraph-link'>
            &nbsp;luigmp@gmail.com
          </Link>
        </p>
      </div>

      <div className='paragraph'>
        <h3 className='paragraph-highlight'>#Apoyo al Proyecto:</h3>
        <p className='paragraph-break'>
          Si te gusta PIXIS y deseas apoyar su desarrollo, puedes patrocinar el proyecto donando un café ❤️☕.
        </p>
      </div>
    </Popup>
  )
}

export default AboutShumShots
