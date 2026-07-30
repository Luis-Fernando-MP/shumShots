import type { ComponentType, ReactNode } from 'react'

interface PresetBuilder {
  key: string
  Title: ReactNode
  Description: ReactNode
  Builder: ComponentType<any>
  Preview: ComponentType<any>
}

export default PresetBuilder
