import { basicColors } from '@/app/defaults/colors'
import Button from '@/shared/ui/Button'
import { PipetteIcon } from 'lucide-react'
import type { FC } from 'react'

import { extractColor } from '../extractColor'
export type SpreadColor = { r: string; g: string; b: string; a: string }

interface Props {
  background: string | null
  setBackground: (background: string, spreadColor: SpreadColor | null) => void
}

/**
 * ColorsController component allows users to select a color from a predefined set of basic colors.
 *
 * @param {string | null} background - The current background color.
 * @param {(background: string) => void} setBackground - Function to update the background color.
 */
const ColorsController: FC<Props> = ({ background, setBackground }) => {
  return (
    <section className='flex gap-3'>
      <div className='flex max-w-[270px] flex-col gap-2'>
        <h5>Default</h5>
        <div className='flex flex-row flex-wrap overflow-hidden rounded-lg'>
          {basicColors.map(color => {
            return (
              <button
                className='size-[30px] aspect-square'
                style={{ backgroundColor: color }}
                key={color}
                onClick={() => setBackground(color, extractColor(color))}
              />
            )
          })}
        </div>
      </div>
      {/* TODO: Agregar los colores adaptativos de las imágenes cargadas */}
      <Button>
        <PipetteIcon />
        <h4>Picar nuevo color</h4>
      </Button>
    </section>
  )
}

export default ColorsController
