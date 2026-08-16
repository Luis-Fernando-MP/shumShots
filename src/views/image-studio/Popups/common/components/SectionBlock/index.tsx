'use client'

import Text from '@common/components/Text'
import { useSectionSearch } from '@views/image-studio/components/section-search'
import type { FC, ReactNode } from 'react'

type Props = {
  title: string
  level?: 1 | 2
  description?: string
  keywords?: string
  children: ReactNode
}

/**
 * Sección de dominio: título corto. `description` solo alimenta la búsqueda.
 */
const SectionBlock: FC<Props> = ({ title, description, keywords, children }) => {
  const visible = useSectionSearch([title, description, keywords])
  if (!visible) return null

  return (
    <section className='flex flex-col gap-2' data-section-block>
      <Text.heading>{title}</Text.heading>
      {children}
    </section>
  )
}

export default SectionBlock
