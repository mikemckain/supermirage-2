import { NextRequest, NextResponse } from 'next/server'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3Client, bucketName } from '@/lib/backblaze'
import { shuffleArray } from '@/lib/shuffle'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export interface MediaItem {
  key: string
  type: 'image' | 'video'
}

export interface MediaResponse {
  items: MediaItem[]
  order: string
  nextOffset?: number
}

const getFileType = (key: string): 'image' | 'video' => {
  const extension = key.toLowerCase().split('.').pop()
  const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v']
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
  
  if (videoExtensions.includes(extension || '')) {
    return 'video'
  }
  
  // Default to image for known image extensions or unknown extensions
  return 'image'
}

// Simple in-memory cache of all object keys to reduce list calls
let cachedKeys: string[] | null = null
let cachedAt = 0
const CACHE_TTL_MS = 60_000

const listAllKeys = async (): Promise<string[]> => {
  const now = Date.now()
  if (cachedKeys && now - cachedAt < CACHE_TTL_MS) {
    return cachedKeys
  }

  let continuationToken: string | undefined = undefined
  const keys: string[] = []

  // Loop through all pages
  // MaxKeys kept modest per request by SDK; we'll paginate until complete
  // For a few hundred items this is fast (<100ms typical)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
    })
    const response = await s3Client.send(command)
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && obj.Size && obj.Size > 0) {
          keys.push(obj.Key)
        }
      }
    }
    if (!response.IsTruncated) break
    continuationToken = response.NextContinuationToken || undefined
  }

  cachedKeys = keys
  cachedAt = now
  return keys
}

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const orderParam = searchParams.get('order')
    const offsetParam = searchParams.get('offset')

    const pageSize = 24
    const offset = Math.max(0, offsetParam ? parseInt(offsetParam, 10) || 0 : 0)
    // If no order provided, create a fresh random 32-bit seed token for this session
    // We encode as a decimal string to keep it simple
    const order = orderParam || String((Math.floor(Math.random() * 0xffffffff) >>> 0))
    const seedNumber = parseInt(order, 10)

    const keys = await listAllKeys()
    // Build full media list (images and videos)
    const allItems: MediaItem[] = keys.map(key => ({ key, type: getFileType(key) }))

    // Deterministic global shuffle based on the per-request order token
    const shuffled = Number.isFinite(seedNumber) ? shuffleArray(allItems, seedNumber) : allItems

    const pageItems = shuffled.slice(offset, offset + pageSize)
    const nextOffset = offset + pageItems.length < shuffled.length ? offset + pageItems.length : undefined

    const result: MediaResponse = {
      items: pageItems,
      order,
      nextOffset,
    }

    return NextResponse.json(result, {
      headers: {
        // Allow CDN to cache identical requests briefly; listAllKeys memoizes for 60s
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
} 