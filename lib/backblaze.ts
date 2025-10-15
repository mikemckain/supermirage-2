import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: 'us-west-004', // Use hardcoded region for Backblaze B2
  endpoint: process.env.B2_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
  forcePathStyle: true, // Required for Backblaze B2
})

export const bucketName = process.env.B2_BUCKET || 'supermirage'

export const getDownloadUrl = (key: string): string => {
  // Handle local test files
  if (key.startsWith('test/')) {
    return `/${key}`
  }

  // Route images through our proxy to enforce correct Content-Type; videos direct
  const extension = (key.split('.').pop() || '').toLowerCase()
  const videoExtensions = new Set(['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v'])
  if (!videoExtensions.has(extension)) {
    const encodedKey = key
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/')
    return `/api/image?key=${encodedKey}`
  }

  // For videos, keep direct Backblaze URL
  const bucketDomain = `supermirage.s3.us-west-004.backblazeb2.com`
  const encoded = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `https://${bucketDomain}/${encoded}`
} 