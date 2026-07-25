import { NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

const unsplashAPI = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY ?? ''
})

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600'
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const query = url.searchParams.get('query') ?? ''
  const perPage = Number(url.searchParams.get('per_page') ?? '10')
  const page = Number(url.searchParams.get('page') ?? '1')

  if (!query) {
    return NextResponse.json({ success: false, message: 'No query provided', data: null }, { status: 400 })
  }

  try {
    const request = await unsplashAPI.search.getPhotos({
      query,
      perPage,
      page,
      orientation: 'landscape'
    })

    if (request.status !== 200 || !request.response) {
      throw new Error('Failed to get photos')
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
      { status: 500, headers: CACHE_HEADERS }
    )
  }
}
