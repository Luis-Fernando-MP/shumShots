import { Input } from '@common/ui/Input'
import type { FC } from 'react'

import { PreferenceField, PreferenceToggle } from '../PreferenceField'

interface Props {
  fontSize?: number
  setFontSize: (fontSize: number) => void
}

const FontSizePreference: FC<Props> = ({ fontSize, setFontSize }) => {
  if (!fontSize) return null

  return (
    <PreferenceField
      title='Tamaño de fuente'
      subtitle='Escala del código'
      example='Ej: Normal = 14px'
    >
      <Input
        type='number'
        size='sm'
        variant='outline'
        suffix='px'
        value={fontSize}
        min={10}
        max={22}
        onChange={e => setFontSize(Number(e.target.value))}
        containerClassName='w-[7.5rem]'
      />
      <PreferenceToggle
        value={fontSize}
        options={[10, 14, 16, 18, 20] as const}
        onChange={setFontSize}
        normal={14}
      />
    </PreferenceField>
  )
}

export default FontSizePreference
