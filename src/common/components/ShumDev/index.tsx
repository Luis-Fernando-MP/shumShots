import ShumLogo from '@common/assets/ShumLogo'
import type { FC } from 'react'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  radius?: 'circle' | 'rounded' | 'none'
}

/**
 * @param {string} size - The size of the shum dev logo. xs, sm, md, lg, xl.
 * @param {string} radius - The radius of the shum dev logo. circle, rounded, none.
 */

const ShumDev: FC<Props> = ({ size = 'xs', radius = 'rounded' }) => {
  return (
    <section className={`grid size-fit place-content-center border-[1.5px] border-[#868686] bg-[#013936e3] ${radius === 'circle' ? 'rounded-full' : radius === 'rounded' ? 'rounded' : 'rounded-none border-0 p-0'} ${size === 'xs' ? 'p-1 [&>svg]:size-[21px]' : size === 'sm' ? 'p-2 [&>svg]:size-7' : size === 'md' ? 'p-2.5 [&>svg]:size-8' : size === 'lg' ? 'p-3 [&>svg]:size-16' : 'p-4 [&>svg]:size-24'}`}>
      <ShumLogo />
    </section>
  )
}

export default ShumDev
