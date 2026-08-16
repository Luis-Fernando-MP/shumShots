/**
 * Stacking order for PIXIS editor layers. Lower paints first.
 */
const APP_Z_INDEX = {
  canvas: {
    background: 0,
    fill: 0,
    duotone: 1,
    overlay: 2,
    lightBelow: 5,
    slots: 10,
    vignette: 20,
    lightAbove: 30
  },
  slot: {
    base: 0,
    light: 1,
    selected: 15,
    dragging: 20
  },
  frame: {
    silhouette: 0,
    content: 1,
    chrome: 10
  },
  studio: {
    mainBar: 30,
    sidebar: 20,
    dock: 30,
    popup: 80
  }
} as const

export default APP_Z_INDEX
