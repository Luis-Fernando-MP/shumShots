export function newKey(extra: string = '') {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(4)
    crypto.getRandomValues(array)
    return array.join('-') + extra
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36) + extra
}
