'use client'

import { acl } from '@/shared/acl'
import { cn } from '@common/utils/cn'
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
  overlay?: boolean
  compact?: boolean
  onDrop: (paths: DropzoneFile[]) => void
  maxFiles?: number
  children?: (_props: ChildrenProps) => ReactNode
}

export type DropzoneFile = File & { preview: string }

type PromptProps = {
  icon: typeof ImagePlusIcon
  title: string
  description: string
  compact?: boolean
}

const DropzonePrompt: FC<PromptProps> = ({ icon: Icon, title, description, compact = false }) => (
  <section
    className={cn(
      'flex size-full min-h-0 flex-col items-center justify-center text-center',
      compact ? 'gap-1.5 px-2 py-3' : 'gap-3'
    )}
  >
    <div
      className={cn(
        'grid shrink-0 place-content-center bg-foreground p-2 [&>svg]:stroke-background [&>svg]:stroke-2',
        compact ? 'size-8 rounded-sm p-1.5 [&>svg]:size-4' : 'size-12 rounded-lg [&>svg]:size-7'
      )}
    >
      <Icon />
    </div>
    <div className={cn('flex min-w-0 flex-col items-center', compact ? 'gap-0.5' : 'gap-1')}>
      <h2
        className={cn(
          'font-medium text-foreground',
          compact ? 'text-[11px] leading-tight' : 'text-base'
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          'text-muted-foreground max-w-full',
          compact ? 'text-[10px] leading-snug' : 'text-sm'
        )}
      >
        {description}
      </p>
    </div>
  </section>
)

const Dropzone: FC<Props> = ({
  onDrop,
  removeAfterUpload = false,
  overlay = false,
  compact = false,
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
        compact={compact}
        icon={StatusIcon}
        title={isDragAccept ? (compact ? 'Suelta' : '¡Suelta para cargar!') : 'No válido'}
        description={isDragAccept ? (compact ? 'Cargar imagen' : 'Se usará en local por ahora') : 'PNG, JPG o WebP'}
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
        compact={compact}
        icon={StatusIcon}
        title='Suelta o pega'
        description={
          compact
            ? 'PNG · JPG · WebP'
            : `${maxFiles > 1 ? 'Tus imágenes' : 'Una imagen'} · PNG, JPG o WebP`
        }
      />
    )
  }

  const rootClassName = overlay
    ? cn(
        'absolute inset-0 z-10 flex size-full cursor-pointer items-center justify-center rounded-none',
        FOCUS_RESET,
        acl(isDragActive, 'border-primary bg-background/80 border-dashed'),
        acl(isDragActive && !compact, 'rounded-lg border-[3.5px]'),
        acl(isDragActive && compact, 'border-2'),
        acl(isDragReject && !isDragActive, 'bg-semantic-error/20')
      )
    : cn(
        'relative flex size-full min-h-0 cursor-pointer items-center justify-center overflow-hidden bg-background',
        FOCUS_RESET,
        compact
          ? 'rounded-none border-0'
          : 'overflow-auto rounded-lg border-[3.5px] border-background',
        acl(isDragActive && !compact, 'border-primary border-dashed'),
        acl(isDragActive && compact, 'border-primary border-2 border-dashed'),
        acl(isDragReject && !isDragActive, 'bg-semantic-error/20')
      )

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
