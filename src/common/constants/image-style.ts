export const borderStyles = {
  SHARP: 0,
  CURVE: 10,
  ROUND: 20
}

export const stacksStyles = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  NONE: (_: number) => '',
  OFFSET: (i: number) => `translate(${i * 8}px, ${i * 8}px)`,
  AURORA_FLOW: (i: number) =>
    `translate(${i % 2 === 0 ? i * 7 : -i * 7}px, ${Math.sin(i) * 10}px) 
   scale(${1 + Math.sin(i * 0.5) * 0.05}) 
   rotate(${i % 2 === 0 ? i * 2 : -i * 2}deg)`,
  CASCADE: (i: number) => `translate(${i * 5}px, -${i * 6}px) scale(${1 + i * 0.01}) rotate(${i * 3}deg)`,
  FRACTAL_BLOOM: (i: number) =>
    `translate(${Math.sin(i * 6) * i * 10}px, ${Math.cos(i * 6) * i * 10}px) 
   scale(${1 + Math.sin(i * 0.5) * 0.1}) 
   rotate(${i * 18}deg) 
   skew(${Math.sin(i * 0.3) * 10}deg)`,
  GROWING_VINE: (i: number) => `scaleY(${1 + i * 0.05}) rotate(${i * 15}deg)`,
  LAYERED: (i: number) => `translate(-${i * 4}px, -${i * 2}px) rotate(-${i}deg)`,
  LAYERED2: (i: number) => `translate(-${i * 5}px, -${i * 3}px) rotate(-${i * 1.5}deg) scale(${1 - i * 0.02})`,
  OCEAN_WAVES: (i: number) =>
    `translateY(${Math.sin(i * 0.8) * 10}px) skewX(${Math.cos(i * 0.6) * 5}deg) scaleX(${1 + i * 0.05}) rotate(${i * 3.5}deg)`,
  ORBIT: (i: number) => `translate(${Math.cos(i) * 15}px, ${Math.sin(i) * 15}px) rotate(${i * 12}deg)`,
  PICTURE_FRAME: (i: number) =>
    `translate(${Math.cos(i) * 10}px, ${Math.sin(i) * 10}px) 
    rotate(${i * 5}deg) scale(${1 + i * 0.01})`,
  PYRAMID: (i: number) => `scale(${1 + i * 0.05})`,
  PYRAMID_TWO: (i: number) => `scale(${1 + i * 0.05}) translateY(-${i * 4}px) rotate(${i * 3}deg)`,
  ROTATED: (i: number) => `translateY(${i * 3}px) rotate(${i * 3.5}deg) scale(${1 + i * 0.01})`,
  ROSE: (i: number) =>
    `translate(${i % 2 === 0 ? i * 12 : -i * 12}px, ${Math.tan(i * 0.1) * 15}px) 
   scale(${1 - Math.sin(i * 0.04) * 0.5}) 
   rotate(${i * 25}deg) 
   skew(${i % 2 === 0 ? 10 : -10}deg)`,
  SPIRAL: (i: number) => `translate(${i * 4}px, ${i * 4}px) rotate(${i * 15}deg)`,
  STAGGERED: (i: number) => `translate(${i * 5}px, ${i % 2 === 0 ? i * 4 : -i * 4}px) rotate(${i % 2 === 0 ? i * 4 : -i * 4}deg)`,
  VORTEX: (i: number) => `rotate(${i * 10}deg) translate(${i * 6}px, ${i * 6}px) scale(${1 + i * 0.03})`,
  ZIGZAG: (i: number) => `translate(${i * 8}px, ${(i % 2 === 0 ? 1 : -1) * i * 8}px) rotate(${i * 6}deg)`,
  BLOOMING_FLOWER: (i: number) => `scale(${1 + i * 0.02}) rotate(${i * 30}deg)`
}

export const blurStyles = {
  SIMPLE: {
    style: '-10px -3px 3px 0 black',
    blur: 20
  },
  HUG: {
    style: '-10px -3px 10px 0px black',
    blur: 40
  },
  SPREAD: {
    style: '-7px -2px 11px 4px black',
    blur: 50
  },
  DEEP: {
    style: '-10px -3px 20px 3px black',
    blur: 70
  },
  GLOW: {
    style: 'black -10px -3px 33px 4px, black -10px -3px 9px 1px',
    blur: 90
  },
  MULTI: {
    style: 'black -10px -3px 58px 12px, black -10px -3px 16px 2px',
    blur: 100
  }
}

export const perspectivesStyles = [
  '',
  'rotate(-8deg) scale(.9)',
  'perspective(400em) rotateY(-15deg) rotateX(6deg) skew(-8deg,4deg) scale(.86)',
  'rotateX(40deg) rotate(40deg) scale(.8)',
  'perspective(400em) rotateY(15deg) rotateX(6deg) skew(8deg,-4deg)'
]

type TGenerateShadows = {
  x: number
  y: number
  blur: number
  spread: number
  opacity: number
}

export function generateShadow(props: TGenerateShadows) {
  const { x, y, blur, spread, opacity } = props
  const shadow1 = `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity / 100})`
  const shadow2 = `${x * 1.2}px ${y * 1.2}px ${blur * 1.1}px ${spread * 1.1}px rgba(0, 0, 0, ${(opacity * 0.9) / 100})`
  const shadow3 = `${x * 0.8}px ${y * 0.8}px ${blur * 0.9}px ${spread * 0.9}px rgba(0, 0, 0, ${(opacity * 2) / 100})`
  const shadow4 = `${x * 1.5}px ${y * 1.5}px ${blur * 1.2}px ${spread * 1.2}px rgba(0, 0, 0, ${(opacity * 1.1) / 100})`
  const shadow5 = `${x * 0.5}px ${y * 0.5}px ${blur * 0.7}px ${spread * 0.7}px rgba(0, 0, 0, ${(opacity * 0.8) / 100})`

  return `${shadow1}, ${shadow2}, ${shadow3}, ${shadow4}, ${shadow5}`
}

export function generateStackShadow(props: TGenerateShadows) {
  const { x, y, blur, spread, opacity } = props
  const shadow = `${x * 0.5}px ${y * 0.5}px ${blur}px ${spread * 0.5}px rgba(0, 0, 0, ${opacity / 30})`
  return `${shadow}`
}

export const MIN_OVERLAY = 6
export const MAX_OVERLAYS = 100

export const generateOverlays = (start: number, amount: number): string[] => {
  const end = Math.min(start + amount, MAX_OVERLAYS)
  return Array(end - start)
    .fill(0)
    .map((_, i) => `/overlays/${String(start + i + 1).padStart(3, '0')}.png`)
}

export const patterns = Array(12)
  .fill(0)
  .map((_, i) => `pattern-${i + 1}`)
