'use client'

import Button from '@/shared/ui/Button'
import { Input } from '@common/components/Input'
import Typography from '@common/components/Typography'
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
  amber: 'border-[#e5c07b] bg-[rgba(229,192,123,0.35)]',
  blue: 'border-[#61afef] bg-[rgba(97,175,239,0.35)]',
  green: 'border-[#98c379] bg-[rgba(152,195,121,0.35)]',
  pink: 'border-[#c678dd] bg-[rgba(198,120,221,0.35)]'
}

const STYLE_TEXT: Record<KeywordHighlightStyle, string> = {
  primary: 'text-primary',
  amber: 'text-[#e5c07b]',
  blue: 'text-[#61afef]',
  green: 'text-[#98c379]',
  pink: 'text-[#c678dd]'
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
    className={[
      'flex size-8 items-center justify-center rounded-md border p-1',
      selected
        ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
        : 'border-border bg-muted/20 hover:border-foreground/30'
    ].join(' ')}
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
              className='border-border/50 bg-background/40 flex flex-col gap-2.5 rounded-md border p-2.5'
            >
              <div className='flex items-center gap-2'>
                <Typography.Small weight='medium' className='shrink-0 text-foreground/80'>
                  Grupo {index + 1}
                </Typography.Small>
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
                <Typography.Small weight='medium' className='w-14 text-foreground/70'>
                  Color
                </Typography.Small>
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
                  <Typography.Small weight='medium' className='w-14 text-foreground/70'>
                    Icono
                  </Typography.Small>
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
