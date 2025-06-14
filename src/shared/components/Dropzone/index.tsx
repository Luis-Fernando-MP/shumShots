'use client'

import { acl } from '@/shared/acl'
import { ImagePlusIcon, WandIcon, XIcon } from 'lucide-react'
import { FC, ReactNode, memo, useCallback, useEffect, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'

import { toaster } from '../Toast'
import './style.scss'

const acceptedFileTypes = {
  'image/jpg': [],
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
  className?: string
}

export type DropzoneFile = File & { preview: string }

const Dropzone: FC<Props> = ({ onDrop, removeAfterUpload = false, maxFiles = 1, children, className = '', ...dropzoneProps }) => {
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
    autoFocus: true,
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
        <section className='dropzone-content'>
          <section className='dropzone-wrapper'>
            <div className='dropzone-icon'>
              <IconDragging />
            </div>
            <div className='dropzone-contentWrapper'>
              <h2>{isDragAccept ? '¡Suelta para subir!' : 'Formato no válido'}</h2>
              <h5>{isDragAccept ? 'La subida es automática 🚀' : 'Formatos aceptados:'}</h5>
              {!isDragAccept && <p>PNG, JPG o Webp</p>}
            </div>
          </section>
        </section>
      )
    }

    if (files.length > 0 && children) {
      const missingFiles = files.length < maxFiles
      return (
        <section className='dropzone-content'>
          {children({ missingFiles, openFileExplorer: open, files, removeFile: handleRemoveFile, maxFiles })}
        </section>
      )
    }

    return (
      <section className='dropzone-content'>
        <section className='dropzone-wrapper'>
          <div className='dropzone-icon'>
            <IconDragging />
          </div>
          <div className='dropzone-contentWrapper'>
            <h2>Suelta o pega</h2>
            <h5>{maxFiles > 1 ? 'Tus imágenes' : 'Una imagen'}</h5>
            <p>En: PNG, JPG o Webp</p>
          </div>
        </section>
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
      className={`dropzone ${className ?? ''} ${acl(isDragActive, 'dragging')} ${acl(isDragReject && !isDragActive, 'reject')}`}
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
