'use client'

import { Input } from '@common/ui/Input'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { type PreferenceFieldId, getField } from '@views/code-studio/utils/preferences'
import { type FC } from 'react'

import { PreferenceField, PreferenceToggle } from './PreferenceField'

const SchemaPreferenceField: FC<{ fieldId: PreferenceFieldId }> = ({ fieldId }) => {
  const field = getField(fieldId)
  const pixis = usePixisPreferencesStore(s => s.pixis)
  const monaco = usePixisPreferencesStore(s => s.monaco)
  const setPixis = usePixisPreferencesStore(s => s.setPixis)
  const setMonaco = usePixisPreferencesStore(s => s.setMonaco)

  const slice = field.path.startsWith('pixis.') ? 'pixis' : 'monaco'
  const key = field.path.split('.')[1]

  const value = slice === 'pixis' ? pixis[key as keyof typeof pixis] : monaco[key as keyof typeof monaco]

  const onChange = (next: string | number | boolean) => {
    if (slice === 'pixis') setPixis(key as keyof typeof pixis, next as never)
    else setMonaco(key as keyof typeof monaco, next as never)
  }

  const options = (field.options ?? []) as readonly (string | number | boolean)[]

  return (
    <PreferenceField
      title={field.title}
      subtitle={field.subtitle}
      description={field.description}
      example={field.example}
      note={field.note}
      keywords={[field.id, field.path, key].filter(Boolean).join(' ')}
    >
      {field.kind === 'number' && (
        <Input
          type='number'
          size='sm'
          variant='outline'
          suffix={field.suffix}
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={e => onChange(Number(e.target.value))}
          containerClassName='w-[7.5rem]'
        />
      )}
      {options.length > 0 && (
        <PreferenceToggle
          value={value as string | number | boolean}
          options={options}
          onChange={onChange}
          normal={field.default as string | number | boolean}
          label={
            fieldId === 'lineHeight'
              ? v => (v === field.default ? 'Normal' : `x${(Number(v) / Number(field.default)).toFixed(1)}`)
              : fieldId === 'exportScale'
                ? v => `x${v}`
                : undefined
          }
        />
      )}
    </PreferenceField>
  )
}

export default SchemaPreferenceField
