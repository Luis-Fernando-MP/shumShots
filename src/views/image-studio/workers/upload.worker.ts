import { UploadImage } from '@/app/api/upload/CldImageResponse.type'

/**
 * Uploads an image file to the specified API URL.
 * @param file - The image file to be uploaded, expected to be of type File.
 * @param apiUrl - The URL of the API endpoint where the image will be uploaded.
 * @returns A promise that resolves to the uploaded image URL or an error if the upload fails.
 */
const uploadImage = async (file: File, apiUrl: string) => {
  if (!(file instanceof Blob)) return new Error('Invalid file type')

  const readFileAsBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') return resolve(reader.result)
        reject(new Error('Failed to read file as base64'))
      }
      reader.onerror = () => reject(new Error('Error reading file'))
      reader.readAsDataURL(file)
    })
  }

  try {
    const base64 = await readFileAsBase64(file)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64 })
    })

    if (!response.ok) throw new Error('Error uploading image')

    const data = await response.json()
    if (!data.image) throw new Error('Error uploading image')

    return data as UploadImage
  } catch (error: any) {
    return new Error(`Upload failed: ${error?.message}`)
  }
}

export default uploadImage
