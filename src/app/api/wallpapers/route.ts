import { readdir } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const IMAGE_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png'])

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'wallpapers')
    const entries = await readdir(dir, { withFileTypes: true })

    const data = entries
      .filter(entry => entry.isFile() && IMAGE_EXT.has(path.extname(entry.name).toLowerCase()))
      .map(entry => {
        const name = entry.name
        const id = path.parse(name).name
        return {
          id,
          name,
          path: `/wallpapers/${name}`
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

    return NextResponse.json({ data, success: true }, { headers: CACHE_HEADERS })
  } catch {
    return NextResponse.json({ data: [], success: false, message: 'Wallpapers not found' }, { status: 500, headers: CACHE_HEADERS })
  }
}
