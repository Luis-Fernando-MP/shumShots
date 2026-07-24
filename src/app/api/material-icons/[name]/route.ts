import { createRequire } from 'module'
import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const require = createRequire(import.meta.url)

type RouteContext = {
  params: Promise<{ name: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { name } = await context.params
  const fileName = name.endsWith('.svg') ? name : `${name}.svg`

  if (!/^[a-z0-9._-]+\.svg$/i.test(fileName)) {
    return NextResponse.json({ error: 'Invalid icon name' }, { status: 400 })
  }

  try {
    const iconPath = require.resolve(`material-icon-theme/icons/${fileName}`)
    const resolvedRoot = path.dirname(require.resolve('material-icon-theme/package.json'))
    const iconsDir = path.join(resolvedRoot, 'icons')

    if (!iconPath.startsWith(iconsDir)) {
      return NextResponse.json({ error: 'Invalid icon path' }, { status: 400 })
    }

    const svg = await readFile(iconPath)

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch {
    return NextResponse.json({ error: 'Icon not found' }, { status: 404 })
  }
}
