'use client'

import { Tab } from '@common/components/Tabs'
import type { FC } from 'react'

type TabItem = {
  id: string
  label?: string
}

type Props = {
  items: TabItem[]
  activeId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  addLabel?: string
  labelPrefix?: string
  addDisabled?: boolean
  addDisabledReason?: string
}

const TabBar: FC<Props> = props => <Tab.Layer {...props} />

export default TabBar
