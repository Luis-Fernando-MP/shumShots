'use client'

import Tooltip from '@common/ui/Tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type JSX, type ReactNode } from 'react'

interface IProviders {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
}

const queryClient = new QueryClient()

const Providers = ({ children }: IProviders): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider>{children}</Tooltip.Provider>
    </QueryClientProvider>
  )
}

export default Providers
