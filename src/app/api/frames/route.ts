import cloudinary from '@app/api/upload/cloud'
import { NextResponse } from 'next/server'

const FRAMES_ROOT = 'pixis/frames'

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600'
}

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store'
}

type FrameDto = {
  id: string
  name: string
  group: string | null
  path: string
  preview_path: string
  aspect: number | null
}

type CloudinaryResource = {
  public_id: string
  secure_url: string
  width?: number
  height?: number
  format?: string
  filename?: string
  display_name?: string
  asset_folder?: string
  folder?: string
}

const toGroup = (assetFolder: string | undefined) => {
  if (!assetFolder) return null
  const normalized = assetFolder.replace(/^\/+|\/+$/g, '')
  if (normalized === FRAMES_ROOT) return null
  const prefix = `${FRAMES_ROOT}/`
  if (!normalized.startsWith(prefix)) return null
  return normalized.slice(prefix.length) || null
}

const toPreviewUrl = (publicId: string, format?: string, aspect?: number | null) => {
  const portrait = !aspect || aspect < 1
  return cloudinary.url(publicId, {
    secure: true,
    format: format || undefined,
    transformation: [
      portrait
        ? { width: 120, height: 220, crop: 'fit', quality: 40, fetch_format: 'auto' }
        : { width: 200, height: 120, crop: 'fit', quality: 40, fetch_format: 'auto' }
    ]
  })
}

const listFrameResources = async () => {
  const resources: CloudinaryResource[] = []
  let nextCursor: string | undefined

  do {
    let query = cloudinary.search
      .expression(`asset_folder:${FRAMES_ROOT}/* OR asset_folder=${FRAMES_ROOT}`)
      .max_results(500)

    if (nextCursor) query = query.next_cursor(nextCursor)

    const result = await query.execute()
    resources.push(...((result.resources ?? []) as CloudinaryResource[]))
    nextCursor = result.next_cursor as string | undefined
  } while (nextCursor)

  return resources
}

export async function GET() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { data: [], success: false, message: 'Missing Cloudinary credentials' },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  try {
    const resources = await listFrameResources()

    const frames: FrameDto[] = resources
      .map(resource => {
        const aspect =
          resource.width && resource.height && resource.height > 0
            ? Math.round((resource.width / resource.height) * 1000) / 1000
            : null

        return {
          id: resource.public_id,
          name: resource.filename || resource.display_name || resource.public_id,
          group: toGroup(resource.asset_folder || resource.folder),
          path: resource.secure_url,
          preview_path: toPreviewUrl(resource.public_id, resource.format, aspect),
          aspect
        }
      })
      .sort((a, b) => {
        const groupCmp = (a.group ?? '').localeCompare(b.group ?? '', undefined, { sensitivity: 'base' })
        if (groupCmp !== 0) return groupCmp
        return a.name.localeCompare(b.name, undefined, { numeric: true })
      })

    return NextResponse.json({ data: frames, success: true }, { headers: CACHE_HEADERS })
  } catch (error) {
    console.error('Error listing Cloudinary frames:', error)
    return NextResponse.json(
      { data: [], success: false, message: 'Error fetching frames from Cloudinary' },
      { status: 500, headers: NO_STORE_HEADERS }
    )
  }
}
