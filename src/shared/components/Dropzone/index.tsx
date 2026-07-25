'use client'

import { acl } from '@/shared/acl'
import { ImagePlusIcon, WandIcon, XIcon } from 'lucide-react'
import { type FC, type ReactNode, memo, useCallback, useEffect, useState } from 'react'
import { type DropzoneOptions, useDropzone } from 'react-dropzone'

import { toaster } from '@common/ui/Toast'

const acceptedFileTypes = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': []
}

const FOCUS_RESET =
  'outline-none focus:outline-none focus-visible:outline-none [&_input]:outline-none'

interface ChildrenProps {
  missingFiles: boolean
  openFileExplorer: () => void
  files: DropzoneFile[]
  maxFiles: number
  removeFile: (_file: DropzoneFile) => void
}

interface Props extends Omit<DropzoneOptions, 'onDrop' | 'accept'> {
  removeAfterUpload?: boolean
  /** Transparent hit area until drag; keeps replace-by-click/drop available over content. */
  overlay?: boolean
  onDrop: (paths: DropzoneFile[]) => void
  maxFiles?: number
  children?: (_props: ChildrenProps) => ReactNode
}

export type DropzoneFile = File & { preview: string }

type PromptProps = {
  icon: typeof ImagePlusIcon
  title: string
  description: string
}

const DropzonePrompt: FC<PromptProps> = ({ icon: Icon, title, description }) => (
  <section className='flex size-full flex-col items-center justify-center gap-3 text-center'>
    <div className='grid size-12 place-content-center rounded-lg bg-foreground p-2 [&>svg]:size-7 [&>svg]:stroke-background [&>svg]:stroke-2'>
      <Icon />
    </div>
    <div className='flex flex-col items-center gap-1'>
      <h2 className='text-base font-medium text-foreground'>{title}</h2>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  </section>
)

const Dropzone: FC<Props> = ({
  onDrop,
  removeAfterUpload = false,
  overlay = false,
  maxFiles = 1,
  children,
  ...dropzoneProps
}) => {
  const [files, setFiles] = useState<DropzoneFile[]>([])

  const commitFiles = useCallback(
    (next: DropzoneFile[]) => {
      setFiles(prev => {
        prev.forEach(file => {
          if (!next.includes(file)) URL.revokeObjectURL(file.preview)
        })
        return next
      })
      onDrop(next)
    },
    [onDrop]
  )

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const incoming = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
      const next = [...files, ...incoming]

      if (next.length <= maxFiles) {
        commitFiles(next)
        return
      }

      // At capacity: replace with the newest selection (supports swap when maxFiles=1).
      if (incoming.length <= maxFiles) {
        commitFiles(incoming.slice(0, maxFiles))
        return
      }

      incoming.forEach(file => URL.revokeObjectURL(file.preview))
      toaster({ title: 'Haz supera el limite de imágenes', type: 'error', id: 'dropzone-max-files' })
    },
    [commitFiles, files, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    maxFiles,
    ...dropzoneProps,
    accept: acceptedFileTypes,
    onDrop: handleDrop
  })

  const handleRemoveFile = useCallback(
    (fileToRemove: DropzoneFile) => {
      commitFiles(files.filter(file => file !== fileToRemove))
    },
    [commitFiles, files]
  )

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  if (removeAfterUpload && files.length > 0 && !overlay) return null

  const StatusIcon = isDragActive ? (isDragAccept ? WandIcon : XIcon) : ImagePlusIcon

  let content: ReactNode = null
  if (isDragActive) {
    content = (
      <DropzonePrompt
        icon={StatusIcon}
        title={isDragAccept ? '¡Suelta para cargar!' : 'Formato no válido'}
        description={isDragAccept ? 'Se usará en local por ahora' : 'PNG, JPG o WebP'}
      />
    )
  } else if (!overlay && files.length > 0 && children) {
    content = (
      <section className='flex size-full flex-col items-center justify-center text-center'>
        {children({
          missingFiles: files.length < maxFiles,
          openFileExplorer: open,
          files,
          removeFile: handleRemoveFile,
          maxFiles
        })}
      </section>
    )
  } else if (!overlay) {
    content = (
      <DropzonePrompt
        icon={StatusIcon}
        title='Suelta o pega'
        description={`${maxFiles > 1 ? 'Tus imágenes' : 'Una imagen'} · PNG, JPG o WebP`}
      />
    )
  }

  const rootClassName = overlay
    ? `absolute inset-0 z-10 flex size-full cursor-pointer items-center justify-center ${FOCUS_RESET} ${acl(isDragActive, 'rounded-lg border-[3.5px] border-dashed border-primary bg-background/80')} ${acl(isDragReject && !isDragActive, 'bg-semantic-error/20')}`
    : `relative flex size-full cursor-pointer items-center justify-center overflow-auto rounded-lg border-[3.5px] border-background bg-background ${FOCUS_RESET} ${acl(isDragActive, 'border-primary border-dashed')} ${acl(isDragReject && !isDragActive, 'bg-semantic-error/20')}`

  return (
    <article
      {...getRootProps({
        onClick: event => {
          // Leave Ctrl/Cmd+click for other gestures (e.g. OS/browser); do not open the file picker.
          if (event.ctrlKey || event.metaKey) event.stopPropagation()
        }
      })}
      aria-label='Zona de arrastre de imágenes'
      className={rootClassName}
    >
      <input {...getInputProps()} />
      {content}
    </article>
  )
}

export default memo(Dropzone)
