export function observeCSSVariables(element: HTMLElement, callback: (css: CSSStyleDeclaration) => void) {
  const observer = new MutationObserver(() => {
    const styles = getComputedStyle(element)
    callback(styles)
  })

  observer.observe(element, { attributes: true, attributeFilter: ['style'] })
  return observer
}

export function getDefaultCssVariable(variable: string) {
  const backgroundCss = getComputedStyle(document.documentElement)
  if (!backgroundCss) return ''
  return `rgb(${backgroundCss.getPropertyValue(variable)})`
}
