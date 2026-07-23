import { newKey } from '@/shared/key'
import Button from '@/shared/ui/Button'
import LabeledInput from '@/shared/ui/LabeledInput'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

interface Props {
  fontSize?: number
  setFontSize: (fontSize: number) => void
}

const FontSizePreference: FC<Props> = ({ fontSize, setFontSize }) => {
  if (!fontSize) return null
  return (
    <>
      <Typography.Emphasis>Tamaño de la fuente</Typography.Emphasis>
      <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
        <LabeledInput value={fontSize} min={10} max={22} type='number' onChange={e => setFontSize(Number(e.target.value))}>
          px
        </LabeledInput>
      </div>
      <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
        {[10, 14, 16, 18, 20].map(style => {
          const normal = 14
          return (
            <Button key={newKey()} onClick={() => setFontSize(style)} active={fontSize === style}>
              {style === normal ? 'Normal' : style}
            </Button>
          )
        })}
      </div>
    </>
  )
}

export default FontSizePreference
