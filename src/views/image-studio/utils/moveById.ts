export const moveById = <T extends { id: string }>(
  list: T[],
  activeId: string,
  overId: string
): T[] | null => {
  const fromIndex = list.findIndex(item => item.id === activeId)
  const toIndex = list.findIndex(item => item.id === overId)
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null
  const next = [...list]
  const [item] = next.splice(fromIndex, 1)
  if (!item) return null
  next.splice(toIndex, 0, item)
  return next
}
