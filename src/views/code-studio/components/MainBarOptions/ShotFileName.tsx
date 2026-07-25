'use client'

import { toaster } from '@common/ui/Toast'
import Button from '@/shared/ui/Button'
import { domCapture } from '@common/lib/snapdom'
import Input from '@common/ui/Input'
import { copyImage } from '@lucide/lab'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { CloudDownload, Icon } from 'lucide-react'
import { type ChangeEvent, type FC, useState } from 'react'
import toast from 'react-hot-toast'

const ILLEGAL = /[\\/:*?"<>|]/g
const SHOT_WITH_BG_ID = 'monacoEditor-container'
const SHOT_WITHOUT_BG_ID = 'monacoEditor'
const EXPORT_SCALE_MIN = 4
const EXPORT_SCALE_MAX = 10

type ShotAction = 'download' | 'copy'

const clampExportScale = (value: number) =>
  Math.min(EXPORT_SCALE_MAX, Math.max(EXPORT_SCALE_MIN, Math.round(value)))

const resolveTarget = (withBackground: boolean) =>
  document.getElementById(withBackground ? SHOT_WITH_BG_ID : SHOT_WITHOUT_BG_ID)

const ShotFileName: FC = () => {
  const [fileName, setFileName] = useState('pixis')
  const [busy, setBusy] = useState(false)
  const exportScale = usePixisPreferencesStore(s => clampExportScale(s.pixis.exportScale ?? 5))

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value.replace(ILLEGAL, ''))
  }

  const handleBlur = () => {
    const next = fileName.trim() || 'pixis'
    if (next !== fileName) setFileName(next)
  }

  const run = async (withBackground: boolean, action: ShotAction) => {
    if (busy) return
    const element = resolveTarget(withBackground)
    if (!element) {
      toaster({ title: 'No se encontró el editor', type: 'error' })
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

  const askBackground = (action: ShotAction) => {
    if (busy) return
    toaster.question({
      title: action === 'download' ? '¿Cómo descargar?' : '¿Cómo copiar?',
      description: 'Con el fondo del contenedor, o solo el editor.',
      type: 'info',
      duration: Number.POSITIVE_INFINITY,
      actionLabel: 'Con fondo',
      onAction: () => void run(true, action),
      secondActionLabel: 'Sin fondo',
      onSecondAction: () => void run(false, action)
    })
  }

  return (
    <div className='gap-grid-sm flex items-center'>
      <Input
        value={fileName}
        onChange={handleChange}
        onBlur={handleBlur}
        spellCheck={false}
        autoComplete='off'
        aria-label='Nombre del archivo'
        placeholder='pixis'
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
        onClick={() => askBackground('download')}
      >
        <CloudDownload />
      </Button>

      <Button
        tooltip={`Copiar imagen (x${exportScale})`}
        variant='dashed'
        status='primary'
        size='icon'
        disabled={busy}
        onClick={() => askBackground('copy')}
      >
        <Icon iconNode={copyImage} />
      </Button>
    </div>
  )
}

export default ShotFileName
