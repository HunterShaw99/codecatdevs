import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const service = searchParams.get('service') || 'route'
  const coordinates = searchParams.get('coordinates')
  const annotations = searchParams.get('annotations') || 'distance'

  if (!coordinates) {
    return NextResponse.json({ error: 'Coordinates parameter is required' }, { status: 400 })
  }

  const osrmUrl = `http://router.project-osrm.org/${service}/v1/driving/${coordinates}?annotations=${annotations}&geometries=geojson&overview=full`

  try {
    const response = await fetch(osrmUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`OSRM request failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Routing proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch route data' },
      { status: 500 }
    )
  }
}