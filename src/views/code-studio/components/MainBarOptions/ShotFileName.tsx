'use client'

import { toaster } from '@/shared/components/Toast'
import Button from '@/shared/ui/Button'
import { domCapture } from '@common/lib/snapdom'
import Input from '@common/ui/Input'
import { copyImage } from '@lucide/lab'
import { CloudDownload, Icon } from 'lucide-react'
import { type ChangeEvent, type FC, useState } from 'react'
import toast from 'react-hot-toast'

const ILLEGAL = /[\\/:*?"<>|]/g
const SHOT_TARGET_ID = 'monacoEditor-container'

const resolveTarget = () => document.getElementById(SHOT_TARGET_ID)

const ShotFileName: FC = () => {
  const [fileName, setFileName] = useState('pixis')
  const [busy, setBusy] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value.replace(ILLEGAL, ''))
  }

  const handleBlur = () => {
    const next = fileName.trim() || 'pixis'
    if (next !== fileName) setFileName(next)
  }

  const run = async (action: (element: HTMLElement) => Promise<void>, errorTitle: string) => {
    if (busy) return
    const element = resolveTarget()
    if (!element) {
      toaster({ title: 'No se encontró el editor', type: 'error' })
      return
    }

    const toastId = toaster({ title: 'Procesando imagen...', type: 'pending' })
    setBusy(true)
    try {
      await action(element)
      toaster({ title: 'Completado', type: 'success', id: toastId })
    } catch (error) {
      console.error(error)
      toaster({ title: errorTitle, type: 'error', id: toastId })
    } finally {
      setTimeout(() => toast.dismiss(toastId), 2500)
      setBusy(false)
    }
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
        tooltip='Descargar imagen'
        variant='dashed'
        status='primary'
        size='icon'
        disabled={busy}
        onClick={() => run(el => domCapture.download(el, fileName), 'La descarga ha fallado')}
      >
        <CloudDownload />
      </Button>

      <Button
        tooltip='Copiar imagen'
        variant='dashed'
        status='primary'
        size='icon'
        disabled={busy}
        onClick={() => run(el => domCapture.copy(el), 'No se pudo copiar la imagen')}
      >
        <Icon iconNode={copyImage} />
      </Button>
    </div>
  )
}

export default ShotFileName
