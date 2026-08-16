export const extractColor = (color: string) => {
  const regex = new RegExp(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  const match = regex.exec(color)

  if (!match) return null
  const [, r, g, b, a] = match
  return { r, g, b, a }
}
