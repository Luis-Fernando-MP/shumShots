'use client'

import { acl } from '@/shared/acl'
import { ImagePlusIcon, WandIcon, XIcon } from 'lucide-react'
import { FC, ReactNode, memo, useCallback, useEffect, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'

import { toaster } from '@common/ui/Toast'
const acceptedFileTypes = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': []
}

interface ChildrenProps {
  missingFiles: boolean
  openFileExplorer: () => void
  files: DropzoneFile[]
  maxFiles: number
  removeFile: (_file: DropzoneFile) => void
}

interface Props extends Omit<DropzoneOptions, 'onDrop' | 'accept'> {
  removeAfterUpload?: boolean
  onDrop: (paths: DropzoneFile[]) => void
  maxFiles?: number
  children?: (_props: ChildrenProps) => ReactNode
}

export type DropzoneFile = File & { preview: string }

const Dropzone: FC<Props> = ({ onDrop, removeAfterUpload = false, maxFiles = 1, children, ...dropzoneProps }) => {
  const [files, setFiles] = useState<DropzoneFile[]>([])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const previewFiles = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
      const updatedFiles = [...files, ...previewFiles]
      if (updatedFiles.length > maxFiles) {
        toaster({ title: 'Haz supera el limite de imágenes', type: 'error', id: 'dropzone-max-files' })
        return
      }

      const slicedFiles = updatedFiles.slice(0, maxFiles)
      setFiles(slicedFiles)
      onDrop(slicedFiles)
    },
    [files, maxFiles, onDrop]
  )

  const dropzone = useDropzone({
    maxFiles,
    ...dropzoneProps,
    accept: acceptedFileTypes,
    onDrop: handleDrop
  })

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = dropzone

  const handleRemoveFile = useCallback(
    (fileToRemove: DropzoneFile) => {
      URL.revokeObjectURL(fileToRemove.preview)
      const updatedFiles = files.filter(file => file !== fileToRemove)
      setFiles(updatedFiles)
      onDrop(updatedFiles)
    },
    [files, onDrop]
  )

  const renderContent = useCallback(() => {
    if (isDragActive) {
      return (
        <section className='flex size-full flex-col items-center justify-center gap-3 text-center'>
          <div className='grid size-12 place-content-center rounded-lg bg-foreground p-2 [&>svg]:size-7 [&>svg]:stroke-background [&>svg]:stroke-2'>
            <IconDragging />
          </div>
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-base font-medium text-foreground'>
              {isDragAccept ? '¡Suelta para cargar!' : 'Formato no válido'}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {isDragAccept ? 'Se usará en local por ahora' : 'PNG, JPG o WebP'}
            </p>
          </div>
        </section>
      )
    }

    if (files.length > 0 && children) {
      const missingFiles = files.length < maxFiles
      return (
        <section className='flex size-full flex-col items-center justify-center text-center'>
          {children({ missingFiles, openFileExplorer: open, files, removeFile: handleRemoveFile, maxFiles })}
        </section>
      )
    }

    return (
      <section className='flex size-full flex-col items-center justify-center gap-3 text-center'>
        <div className='grid size-12 place-content-center rounded-lg bg-foreground p-2 [&>svg]:size-7 [&>svg]:stroke-background [&>svg]:stroke-2'>
          <IconDragging />
        </div>
        <div className='flex flex-col items-center gap-1'>
          <h2 className='text-base font-medium text-foreground'>Suelta o pega</h2>
          <p className='text-sm text-muted-foreground'>
            {maxFiles > 1 ? 'Tus imágenes' : 'Una imagen'} · PNG, JPG o WebP
          </p>
        </div>
      </section>
    )
  }, [isDragActive, isDragAccept, files, children, maxFiles, open, handleRemoveFile])

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  if (removeAfterUpload && files.length > 0) return null
  const IconHover = isDragAccept ? WandIcon : XIcon
  const IconDragging = isDragActive ? IconHover : ImagePlusIcon

  return (
    <article
      {...getRootProps()}
      aria-label='Zona de arrastre de imágenes'
      className={`relative flex size-full cursor-pointer items-center justify-center overflow-auto rounded-lg border-[3.5px] border-background bg-background outline-none focus:outline-none focus-visible:outline-none [&_input]:outline-none ${acl(isDragActive, 'border-primary border-dashed')} ${acl(isDragReject && !isDragActive, 'bg-semantic-error/20')}`}
    >
      <input {...getInputProps()} />
      {renderContent()}
    </article>
  )
}

/**
 * @description Dropzone component for uploading images.
 * @param { (paths: DropzoneFile[]) => void } onDrop - Callback function to handle dropped files.
 * @param { boolean } removeAfterUpload - Whether to remove the dropped files after uploading.
 * @param { number } maxFiles - Maximum number of allowed files.
 * @param { ReactNode } children - Custom children component, if provided, will render the children component with the following props: missingFiles, openFileExplorer, files, maxFiles, removeFile
 * @param { DropzoneOptions } dropzoneProps - Additional props for the Dropzone component.
 */
export default memo(Dropzone)
