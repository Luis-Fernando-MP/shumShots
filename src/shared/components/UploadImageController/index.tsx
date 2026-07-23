import Button from '@/shared/ui/Button'
import { ImagePlusIcon } from 'lucide-react'
import type { FC } from 'react'

interface Props {
  background: string | null
  setBackground: (background: string) => void
}

const UploadImageController: FC<Props> = ({ background, setBackground }) => {
  return (
    <section className='flex flex-col gap-2'>
      <h3 className='paragraph-highlight'># Cargar Imagen:</h3>

      <Button>
        <ImagePlusIcon />
        <h4>Picar nueva imagen</h4>
      </Button>
    </section>
  )
}

export default UploadImageController
