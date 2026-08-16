'use client'

import ShotCapture from '@common/components/ShotCapture'
import type { FC } from 'react'

/**
 * Acciones del dock inferior de Image Studio.
 *
 * @returns El control de captura del canvas.
 */
const MainBarOptions: FC = () => (
  <ShotCapture target='editor' compress={false} scale={6} missingTitle='No se encontró el canvas' />
)

export default MainBarOptions
