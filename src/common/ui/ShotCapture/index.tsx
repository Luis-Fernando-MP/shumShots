'use client'

import Button from '@/shared/ui/Button'
import { domCapture } from '@common/lib/snapdom'
import Input from '@common/ui/Input'
import { toaster } from '@common/ui/Toast'
import { cn } from '@common/utils/cn'
import { copyImage } from '@lucide/lab'
import { CloudDownload, Icon } from 'lucide-react'
import {
  type ChangeEvent,
  type FC,
  type RefObject,
  useState
} from 'react'
import toast from 'react-hot-toast'

const ILLEGAL = /[\\/:*?"<>|]/g
const SCALE_MIN = 1
const SCALE_MAX = 10

type ShotAction = 'download' | 'copy'

/** DOM id, CSS selector, ref, or lazy getter for the node to capture. */
export type ShotCaptureTarget =
  | string
  | RefObject<HTMLElement | null>
  | (() => HTMLElement | null)

export type ShotCaptureProps = {
  /** Primary capture target (e.g. container with background). */
  target: ShotCaptureTarget
  /**
   * Optional second target (e.g. editor without chrome).
   * When set, download/copy ask which target to use.
   */
  alternateTarget?: ShotCaptureTarget
  /** Prompt copy when `alternateTarget` is provided. */
  alternatePrompt?: {
    description?: string
    primaryLabel?: string
    secondaryLabel?: string
  }
  /** Export scale multiplier. @default 5 */
  scale?: number
  /** Initial file name without extension. @default `'pixis'` */
  defaultFileName?: string
  /** Toast when the target node is missing. */
  missingTitle?: string
  className?: string
}

const clampScale = (value: number) => Math.min(SCALE_MAX, Math.max(SCALE_MIN, Math.round(value)))

const resolveTarget = (target: ShotCaptureTarget): HTMLElement | null => {
  if (typeof target === 'function') return target()
  if (typeof target === 'object' && target !== null && 'current' in target) return target.current
  if (typeof target !== 'string' || !target) return null

  if (target.startsWith('#') || target.startsWith('.') || /[\s>+~[\]:]/.test(target)) {
    return document.querySelector<HTMLElement>(target)
  }

  return document.getElementById(target) ?? document.querySelector<HTMLElement>(target)
}

/**
 * Filename input plus download / copy-to-clipboard actions for a DOM shot.
 */
const ShotCapture: FC<ShotCaptureProps> = ({
  target,
  alternateTarget,
  alternatePrompt,
  scale = 5,
  defaultFileName = 'pixis',
  missingTitle = 'No se encontró el elemento a capturar',
  className
}) => {
  const [fileName, setFileName] = useState(defaultFileName)
  const [busy, setBusy] = useState(false)
  const exportScale = clampScale(scale)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value.replace(ILLEGAL, ''))
  }

  const handleBlur = () => {
    const next = fileName.trim() || defaultFileName
    if (next !== fileName) setFileName(next)
  }

  const run = async (useAlternate: boolean, action: ShotAction) => {
    if (busy) return

    const element = resolveTarget(useAlternate && alternateTarget ? alternateTarget : target)
    if (!element) {
      toaster({ title: missingTitle, type: 'error' })
      return
    }

    const errorTitle = action === 'download' ? 'La descarga ha fallado' : 'No se pudo copiar la imagen'
    const toastId = toaster({ title: 'Procesando imagen...', type: 'pending' })
    setBusy(true)
    try {
      if (action === 'download') {
        await domCapture.download(element, fileName, { scale: exportScale })
      } else {
        await domCapture.copy(element, { scale: exportScale })
      }
      toaster({ title: 'Completado', type: 'success', id: toastId })
    } catch (error) {
      console.error(error)
      toaster({ title: errorTitle, type: 'error', id: toastId })
    } finally {
      setTimeout(() => toast.dismiss(toastId), 2500)
      setBusy(false)
    }
  }

  const askOrRun = (action: ShotAction) => {
    if (busy) return

    if (!alternateTarget) {
      void run(false, action)
      return
    }

    toaster.question({
      title: action === 'download' ? '¿Cómo descargar?' : '¿Cómo copiar?',
      description: alternatePrompt?.description ?? 'Con el fondo del contenedor, o solo el contenido.',
      type: 'info',
      duration: Number.POSITIVE_INFINITY,
      actionLabel: alternatePrompt?.primaryLabel ?? 'Con fondo',
      onAction: () => void run(false, action),
      secondActionLabel: alternatePrompt?.secondaryLabel ?? 'Sin fondo',
      onSecondAction: () => void run(true, action)
    })
  }

  return (
    <div className={cn('gap-grid-sm flex items-center', className)}>
      <Input
        value={fileName}
        onChange={handleChange}
        onBlur={handleBlur}
        spellCheck={false}
        autoComplete='off'
        aria-label='Nombre del archivo'
        placeholder={defaultFileName}
        variant='outline'
        suffix='.png'
        containerClassName='w-[10.5rem]'
        className='w-full'
      />

      <Button
        tooltip={`Descargar imagen (x${exportScale})`}
        variant='dashed'
        status='primary'
        size='icon'
        disabled={busy}
        onClick={() => askOrRun('download')}
      >
        <CloudDownload />
      </Button>

      <Button
        tooltip={`Copiar imagen (x${exportScale})`}
        variant='dashed'
        status='primary'
        size='icon'
        disabled={busy}
        onClick={() => askOrRun('copy')}
      >
        <Icon iconNode={copyImage} />
      </Button>
    </div>
  )
}

export default ShotCapture
