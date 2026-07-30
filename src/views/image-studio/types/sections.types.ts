import type { ComponentType, ReactNode } from 'react'

interface SectionBuilder {
  key: string
  title: ReactNode
  description: ReactNode
  SectionIcon: ReactNode
  component: ComponentType<any>
}

export default SectionBuilder
