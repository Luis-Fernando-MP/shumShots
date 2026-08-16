import type { FC } from 'react'

interface Props {
  rotate?: number
}

const Corner: FC<Props> = ({ rotate = 0 }) => {
  return (
    <svg viewBox='0 0 34 34' fill='none' width={13} height={13} style={{ transform: `rotate(${rotate}deg)` }}>
      <path
        d='M2 32V17C2 13.0218 3.58035 9.20644 6.3934 6.3934C9.20644 3.58035 13.0218 2 17 2H32'
        stroke='rgb(var(--fnt-secondary))'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Corner
