import { snapdom } from '@zumer/snapdom'

type CaptureCache = 'soft' | 'auto' | 'full' | 'disabled'

export type DomCaptureOptions = {
  /** Escala de salida. Por defecto: `5`. */
  scale?: number
  /** Embebe `@font-face` en la captura. Por defecto: `true`. */
  embedFonts?: boolean
  /** Omite delays idle para capturar más rápido. Por defecto: `true`. */
  fast?: boolean
  /** Reduce imágenes incrustadas a su resolución visible. Por defecto: `true`. */
  compress?: boolean
  /** Política de caché entre capturas. Por defecto: `'soft'`. */
  cache?: CaptureCache
}

const DEFAULTS = {
  scale: 5,
  embedFonts: true,
  fast: true,
  compress: true,
  cache: 'soft'
} as const satisfies Required<DomCaptureOptions>

/**
 * Envoltorio de SnapDOM para capturar un nodo DOM a PNG,
 * descargarlo o copiarlo al portapapeles.
 */
class DomCapture {
  readonly #options: Required<DomCaptureOptions>

  constructor(options: DomCaptureOptions = {}) {
    this.#options = {
      scale: Math.max(1, options.scale ?? DEFAULTS.scale),
      embedFonts: options.embedFonts ?? DEFAULTS.embedFonts,
      fast: options.fast ?? DEFAULTS.fast,
      compress: options.compress ?? DEFAULTS.compress,
      cache: options.cache ?? DEFAULTS.cache
    }
  }

  async #run<T>(element: HTMLElement, task: () => Promise<T>): Promise<T> {
    element.setAttribute('data-capturing', 'true')
    try {
      await document.fonts?.ready
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
      return await task()
    } finally {
      element.removeAttribute('data-capturing')
    }
  }

  async #toCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    return this.#run(element, () => snapdom.toCanvas(element, this.#options))
  }

  /** Devuelve la captura como data URL PNG. */
  async toDataUrl(element: HTMLElement): Promise<string> {
    const canvas = await this.#toCanvas(element)
    return canvas.toDataURL('image/png')
  }

  /** Devuelve la captura como `Blob` PNG. */
  async toBlob(element: HTMLElement): Promise<Blob> {
    const canvas = await this.#toCanvas(element)
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error('No se pudo generar el PNG'))),
        'image/png'
      )
    })
  }

  /** Captura el elemento y descarga un archivo PNG. */
  async download(element: HTMLElement, fileName = 'pixis'): Promise<void> {
    const blob = await this.toBlob(element)
    const name = fileName.trim() || 'pixis'
    const url = URL.createObjectURL(blob)
    try {
      const link = document.createElement('a')
      link.download = name.toLowerCase().endsWith('.png') ? name : `${name}.png`
      link.href = url
      link.click()
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  /** Captura el elemento y lo copia al portapapeles como PNG. */
  async copy(element: HTMLElement): Promise<void> {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
      throw new Error('La API de portapapeles no está disponible')
    }
    const blob = await this.toBlob(element)
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
  }
}

/** Instancia compartida con captura en alta calidad (`scale: 5`). */
const domCapture = new DomCapture()

export default DomCapture
export { DomCapture, domCapture }
export type { CaptureCache }
