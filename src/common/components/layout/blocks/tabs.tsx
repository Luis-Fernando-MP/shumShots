'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@common/components/Tabs'
import { cn } from '@common/utils/cn'
import { Children, type ReactElement, type ReactNode, isValidElement } from 'react'

interface AppTabProps {
  value: string
  label: string
  children?: ReactNode
}

/**
 * Pestaña de chrome. Solo se usa como hijo de `App.tabs`.
 *
 * @param props.value - Identificador de la pestaña.
 * @param props.label - Texto visible en el trigger.
 * @param props.children - Panel que se muestra al activarla.
 */
const AppTab = (_props: AppTabProps) => null

AppTab.displayName = 'App.tab'

interface AppTabsProps {
  children?: ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  footer?: ReactNode
  className?: string
}

const isAppTab = (child: ReactNode): child is ReactElement<AppTabProps> =>
  isValidElement(child) && child.type === AppTab

/**
 * Lista de pestañas del chrome de estudio (radio 12px, tokens PIXIS).
 *
 * @param props.children - Uno o más `App.tab`.
 * @param props.defaultValue - Pestaña inicial. Por defecto, la primera.
 * @param props.footer - Pie opcional (búsqueda, resets) bajo el contenido.
 * @returns El conjunto de triggers y paneles.
 */
const AppTabs = ({ children, defaultValue, value, onValueChange, footer, className }: AppTabsProps) => {
  const tabs: AppTabProps[] = []

  Children.forEach(children, child => {
    if (isAppTab(child)) tabs.push(child.props)
  })

  const initial = defaultValue ?? tabs[0]?.value

  return (
    <Tabs
      defaultValue={value ? undefined : initial}
      value={value}
      onValueChange={onValueChange}
      className={cn('flex h-full min-h-0 flex-col', className)}
    >
      <TabsList className='border-border/50 shrink-0 border-b px-3 py-2.5'>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className='min-h-0 flex-1 overflow-hidden'>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className='flex h-full flex-col overflow-hidden'>
            {tab.children}
          </TabsContent>
        ))}
      </div>

      {footer}
    </Tabs>
  )
}

AppTabs.displayName = 'App.tabs'

export { AppTab, AppTabs }
