'use client'

import { type JSX, type ReactNode, useEffect, useState } from 'react'

import LoaderPage from './LoaderPage'

interface IHydration {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
}

const Hydration = ({ children }: IHydration): JSX.Element => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return <>{isHydrated ? children : <LoaderPage />}</>
}

export default Hydration
