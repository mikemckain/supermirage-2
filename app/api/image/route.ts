import { NextRequest } from 'next/server'

// Force dynamic so we can control headers per request
export const dynamic = 'force-dynamic'

const bucketDomain = 'supermirage.s3.us-west-004.backblazeb2.com'

const imageExtToMime: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  heic: 'image/heic',
  heif: 'image/heif',
}

const inferMimeFromKey = (key: string): string | undefined => {
  const ext = (key.split('.').pop() || '').toLowerCase()
  return imageExtToMime[ext]
}

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key') || ''
    if (!key) {
      return new Response('Missing key', { status: 400 })
    }

    // Build the Backblaze public URL without relying on our getDownloadUrl helper
    const encoded = key
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/')
    const upstreamUrl = `https://${bucketDomain}/${encoded}`

    const upstream = await fetch(upstreamUrl, {
      // Let Vercel/Next cache at the edge; we also set HTTP caching headers below
      cache: 'no-store',
    })

    if (!upstream.ok || !upstream.body) {
      return new Response('Not found', { status: upstream.status || 404 })
    }

    const mime = inferMimeFromKey(key) || 'application/octet-stream'

    // Pass-through useful headers where safe
    const length = upstream.headers.get('content-length') || undefined
    const etag = upstream.headers.get('etag') || undefined
    const lastModified = upstream.headers.get('last-modified') || undefined

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': mime,
        ...(length ? { 'Content-Length': length } : {}),
        ...(etag ? { ETag: etag } : {}),
        ...(lastModified ? { 'Last-Modified': lastModified } : {}),
        // Long-lived CDN caching; content is immutable once uploaded
        'Cache-Control': 'public, s-maxage=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Image proxy error', error)
    return new Response('Internal error', { status: 500 })
  }
}


