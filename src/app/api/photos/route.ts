import { NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600'
}

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store'
}

export async function GET(req: Request) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim()
  if (!accessKey) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing UNSPLASH_ACCESS_KEY in environment',
        data: null
      },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  const url = new URL(req.url)
  const query = url.searchParams.get('query') ?? ''
  const perPage = Number(url.searchParams.get('per_page') ?? '10')
  const page = Number(url.searchParams.get('page') ?? '1')

  if (!query) {
    return NextResponse.json(
      { success: false, message: 'No query provided', data: null },
      { status: 400, headers: NO_STORE_HEADERS }
    )
  }

  const unsplashAPI = createApi({ accessKey })

  try {
    const request = await unsplashAPI.search.getPhotos({
      query,
      perPage,
      page,
      orientation: 'landscape'
    })

    if (request.status === 401 || request.status === 403) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or unauthorized UNSPLASH_ACCESS_KEY',
          data: null
        },
        { status: request.status, headers: NO_STORE_HEADERS }
      )
    }

    if (request.status !== 200 || !request.response) {
      return NextResponse.json(
        {
          success: false,
          message: `Unsplash error (${request.status})`,
          data: null
        },
        { status: 502, headers: NO_STORE_HEADERS }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: request.response
      },
      { headers: CACHE_HEADERS }
    )
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { success: false, message: 'Error fetching photos', data: null },
      { status: 500, headers: NO_STORE_HEADERS }
    )
  }
}
