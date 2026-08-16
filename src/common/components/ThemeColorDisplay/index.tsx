import type { FC } from 'react'

interface Props {
  className?: string
}

const ThemeColorDisplay: FC<Props> = ({ className = '' }) => {
  return <div className={`size-[30px] w-[70px] rounded-md border-[3px] border-muted bg-background bg-gradient-to-br from-secondary via-primary to-background ${className}`} />
}

export default ThemeColorDisplay
