import Logo from '@/shared/assets/Logo'
import type { FC } from 'react'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  radius?: 'circle' | 'rounded' | 'none'
  transparent?: boolean
}

/**
 * @param {string} size - The size of the shum shot's logo. xs, sm, md, lg, xl.
 * @param {string} radius - The radius of the shum shot's logo. circle, rounded, none.
 * @param {boolean} transparent - Whether the shum shot's logo is transparent.
 */

const ShumShots: FC<Props> = ({ size = 'xs', radius = 'rounded', transparent = false }) => {
  return (
    <section className={`grid size-fit place-content-center border-[1.5px] border-primary bg-card ${radius === 'circle' ? 'rounded-full' : radius === 'rounded' ? 'rounded' : 'rounded-none border-0 p-0'} ${transparent ? 'bg-transparent' : ''} ${size === 'xs' ? 'p-1 [&>svg]:size-[21px]' : size === 'sm' ? 'p-1.5 [&>svg]:size-6' : size === 'md' ? 'p-2.5 [&>svg]:size-8' : size === 'lg' ? 'p-3 [&>svg]:size-16' : 'p-4 [&>svg]:size-24'}`}>
      <Logo />
    </section>
  )
}

export default ShumShots
