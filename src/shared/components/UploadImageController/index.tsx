'use client'

import Button from '@/shared/ui/Button'
import { ImagePlusIcon } from 'lucide-react'
import { type ChangeEvent, type FC, useCallback, useEffect, useRef } from 'react'

interface Props {
  background: string | null
  setBackground: (background: string) => void
}

const UploadImageController: FC<Props> = ({ background, setBackground }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
      const blobUrl = URL.createObjectURL(file)
      blobUrlRef.current = blobUrl
      setBackground(blobUrl)

      event.target.value = ''
    },
    [setBackground]
  )

  const isLocalImage = Boolean(background?.startsWith('blob:'))

  return (
    <section className='gap-grid flex flex-col'>
      <input
        ref={inputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        className='hidden'
        onChange={handleChange}
      />
      <Button
        type='button'
        onClick={() => inputRef.current?.click()}
        className='gap-grid flex w-full items-center justify-center'
      >
        <ImagePlusIcon className='size-4' />
        <span>{isLocalImage && 'Cambiar imagen'}{!isLocalImage && 'Cargar imagen'}</span>
      </Button>
    </section>
  )
}

export default UploadImageController
