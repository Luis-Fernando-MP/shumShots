'use client'

import Button from '@common/components/Button'
import { Input } from '@common/components/Input'
import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import {
  PreferenceField,
  PreferencePanel,
  PreferenceSection,
  PreferenceToggle
} from '@views/code-studio/components/preferences/PreferenceField'
import {
  createKeywordGroup,
  KEYWORD_GLYPHS
} from '@views/code-studio/components/UserMonacoPreferences/utils'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import {
  getGroup,
  type KeywordHighlightGroup,
  type KeywordHighlightStyle
} from '@views/code-studio/utils/preferences'
import { Plus, Trash2 } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

const STYLES: readonly KeywordHighlightStyle[] = ['primary', 'amber', 'blue', 'green', 'pink']

const STYLE_SWATCH: Record<KeywordHighlightStyle, string> = {
  primary: 'border-primary bg-primary/30',
  amber: 'border-semantic-warning bg-semantic-warning/35',
  blue: 'border-semantic-info bg-semantic-info/35',
  green: 'border-semantic-success bg-semantic-success/35',
  pink: 'border-secondary bg-secondary/40'
}

const STYLE_TEXT: Record<KeywordHighlightStyle, string> = {
  primary: 'text-primary',
  amber: 'text-semantic-warning',
  blue: 'text-semantic-info',
  green: 'text-semantic-success',
  pink: 'text-secondary'
}

const Swatch = ({
  selected,
  title,
  onClick,
  children
}: {
  selected: boolean
  title: string
  onClick: () => void
  children: ReactNode
}) => (
  <button
    type='button'
    title={title}
    aria-label={title}
    aria-pressed={selected}
    onClick={onClick}
    className={cn(
      'flex size-8 items-center justify-center border p-1',
      chromeTile(selected)
    )}
  >
    {children}
  </button>
)

const KeywordHighlightPreference: FC = () => {
  const section = getGroup('keywordHighlight')
  const keywordHighlight = usePixisPreferencesStore(s => s.monaco.keywordHighlight)
  const glyphMargin = usePixisPreferencesStore(s => s.monaco.glyphMargin)
  const setMonaco = usePixisPreferencesStore(s => s.setMonaco)

  const { groups } = keywordHighlight

  const setGroups = (next: KeywordHighlightGroup[]) => {
    setMonaco('keywordHighlight', { groups: next })
  }

  const patchGroup = (id: string, patch: Partial<KeywordHighlightGroup>) => {
    setGroups(groups.map(g => (g.id === id ? { ...g, ...patch } : g)))
  }

  return (
    <PreferenceSection
      title={section.title}
      subtitle={section.subtitle}
      keywords='keyword highlight palabras clave glyph icono lucide'
    >
      <PreferencePanel>
        <PreferenceField
          title='Margen de glyph'
          subtitle='Columna izquierda de Monaco'
          keywords='glyphMargin'
        >
          <PreferenceToggle
            value={Boolean(glyphMargin)}
            options={[true, false] as const}
            onChange={v => setMonaco('glyphMargin', v)}
          />
        </PreferenceField>

        <div className='flex w-full flex-col gap-2.5'>
          {groups.map((group, index) => (
            <div
              key={group.id}
              className='bg-muted/40 flex flex-col gap-2.5 rounded-[12px] p-2.5'
            >
              <div className='flex items-center gap-2'>
                <Text.caption className='shrink-0'>Grupo {index + 1}</Text.caption>
                <Input
                  type='text'
                  size='sm'
                  variant='outline'
                  value={group.terms}
                  placeholder='términos, por, comas'
                  spellCheck={false}
                  autoComplete='off'
                  aria-label={`Términos grupo ${index + 1}`}
                  onChange={e => patchGroup(group.id, { terms: e.target.value })}
                  containerClassName='min-w-0 flex-1'
                />
                <Button
                  type='button'
                  size='sm'
                  variant='ghost'
                  aria-label={`Eliminar grupo ${index + 1}`}
                  disabled={groups.length <= 1}
                  onClick={() => setGroups(groups.filter(g => g.id !== group.id))}
                >
                  <Trash2 className='size-3.5' strokeWidth={1.5} />
                </Button>
              </div>

              <div className='flex flex-wrap items-center gap-1.5'>
                <Text.caption className='w-14'>Color</Text.caption>
                {STYLES.map(style => (
                  <Swatch
                    key={style}
                    selected={group.style === style}
                    title={style}
                    onClick={() => patchGroup(group.id, { style })}
                  >
                    <span className={`size-full rounded-sm border ${STYLE_SWATCH[style]}`} />
                  </Swatch>
                ))}
              </div>

              {glyphMargin && (
                <div className='flex flex-wrap items-center gap-1.5'>
                  <Text.caption className='w-14'>Icono</Text.caption>
                  {KEYWORD_GLYPHS.map(({ id, Icon }) => (
                    <Swatch
                      key={id}
                      selected={group.glyph === id}
                      title={id}
                      onClick={() => patchGroup(group.id, { glyph: id })}
                    >
                      {id === 'none' && (
                        <span className='text-[10px] text-muted-foreground'>—</span>
                      )}
                      {id === 'logo' && (
                        <span
                          className='size-3 rounded-[2px] bg-cover bg-center'
                          style={{ backgroundImage: "url('/logo.webp')" }}
                        />
                      )}
                      {Icon && <Icon className={`size-3.5 ${STYLE_TEXT[group.style]}`} strokeWidth={2} />}
                    </Swatch>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Button
            type='button'
            size='sm'
            variant='outline'
            onClick={() =>
              setGroups([...groups, createKeywordGroup({ terms: '', style: 'blue', glyph: 'logo' })])
            }
          >
            <Plus className='size-3.5' strokeWidth={1.5} />
            Añadir grupo
          </Button>
        </div>
      </PreferencePanel>
    </PreferenceSection>
  )
}

export default KeywordHighlightPreference
