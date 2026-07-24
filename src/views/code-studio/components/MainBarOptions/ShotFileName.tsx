'use client'

import useDownloadImage from '@/app/hooks/useDownloadImage'
import Button from '@/shared/ui/Button'
import Input from '@common/ui/Input'
import { copyImage } from '@lucide/lab'
import useCodeShotStore from '@views/code-studio/store/codeShot.store'
import { CloudDownload, Icon } from 'lucide-react'
import { type ChangeEvent, type FC } from 'react'

const ILLEGAL = /[\\/:*?"<>|]/g

const ShotFileName: FC = () => {
  const { fileName, setFileName } = useCodeShotStore()
  const { isDownloading, downloadPngImage, copyToClipboard, questionDownload } = useDownloadImage()

  const downloadName = fileName.trim() || 'pixis'

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value.replace(ILLEGAL, ''))
  }

  const handleBlur = () => {
    const next = fileName.trim() || 'pixis'
    if (next !== fileName) setFileName(next)
  }

  const handleDownload = () => {
    questionDownload({
      containerId: 'monacoEditor-container',
      childId: 'monacoEditor',
      onResponse: (element: HTMLElement) => {
        downloadPngImage({
          fileName: downloadName,
          scaleFactor: 5,
          $element: element
        })
      }
    })
  }

  const handleCopy = () => {
    questionDownload({
      containerId: 'monacoEditor-container',
      childId: 'monacoEditor',
      isCopy: true,
      onResponse: (element: HTMLElement) => {
        copyToClipboard({ $element: element, scaleFactor: 5 })
      }
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
        tooltip={`Descargar imágen`}
        variant='dashed'
        status='primary'
        size='icon'
        disabled={isDownloading}
        onClick={handleDownload}
      >
        <CloudDownload />
      </Button>

      <Button tooltip='Copiar imagen' variant='dashed' status='primary' size='icon' disabled={isDownloading} onClick={handleCopy}>
        <Icon iconNode={copyImage} />
      </Button>
    </div>
  )
}

export default ShotFileName
