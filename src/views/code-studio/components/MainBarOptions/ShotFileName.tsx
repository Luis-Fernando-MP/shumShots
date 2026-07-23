import useDownloadImage from '@/app/hooks/useDownloadImage'
import { acl } from '@/shared/acl'
import { toaster } from '@/shared/components/Toast'
import IconButton from '@/shared/ui/IconButton'
import LabelText from '@/shared/ui/LabelText'
import { copyImage } from '@lucide/lab'
import { CloudDownload, Icon } from 'lucide-react'
import { type FC } from 'react'

import useCodeShotStore from '../../store/codeShot.store'

const ShotFileName: FC = () => {
  const { fileName } = useCodeShotStore()

  const { isDownloading, downloadPngImage, copyToClipboard, questionDownload } = useDownloadImage()

  const handleDownload = async () => {
    questionDownload({
      containerId: 'monacoEditor-container',
      childId: 'monacoEditor',
      onResponse: (element: HTMLElement) => {
        downloadPngImage({
          fileName,
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
    <>
      <IconButton
        label='Formatear código'
        transparent
        outline
        className={acl(isDownloading, 'opacity-50')}
        onClick={handleDownload}
      >
        <CloudDownload />
        <p>{fileName}</p>
        <LabelText>.png</LabelText>
      </IconButton>

      <IconButton label='Copiar imagen' className={acl(isDownloading, 'opacity-50')} transparent outline onClick={handleCopy}>
        <Icon iconNode={copyImage} />
      </IconButton>
    </>
  )
}

export default ShotFileName
