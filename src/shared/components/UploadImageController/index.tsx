import Button from '@/shared/ui/Button'
import { ImagePlusIcon } from 'lucide-react'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

interface Props {
  background: string | null
  setBackground: (background: string) => void
}

const UploadImageController: FC<Props> = ({ background, setBackground }) => {
  return (
    <Typography.Block title='Cargar Imagen:' className='flex flex-col gap-2'>
      <Button>
        <ImagePlusIcon />
        <h4>Picar nueva imagen</h4>
      </Button>
    </Typography.Block>
  )
}

export default UploadImageController
