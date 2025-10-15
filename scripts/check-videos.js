#!/usr/bin/env node

/**
 * Script to check for video files in the media bucket
 * Usage: node scripts/check-videos.js
 */

async function checkForVideos() {
  const baseUrl = 'http://localhost:3000/api/media'
  let cursor = null
  let totalItems = 0
  let videoCount = 0
  let pageCount = 0
  
  console.log('🔍 Checking for video files in media bucket...\n')
  
  do {
    try {
      const url = cursor ? `${baseUrl}?cursor=${cursor}` : baseUrl
      console.log(`📄 Fetching page ${pageCount + 1}...`)
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      const videos = data.items.filter(item => item.type === 'video')
      
      console.log(`  📊 Items: ${data.items.length}, Videos: ${videos.length}`)
      
      if (videos.length > 0) {
        console.log('  🎬 Video files found:')
        videos.forEach(video => {
          console.log(`    - ${video.key}`)
        })
      }
      
      totalItems += data.items.length
      videoCount += videos.length
      cursor = data.nextToken
      pageCount++
      
    } catch (error) {
      console.error('❌ Error fetching media:', error.message)
      break
    }
  } while (cursor)
  
  console.log('\n📈 Summary:')
  console.log(`  Total pages: ${pageCount}`)
  console.log(`  Total items: ${totalItems}`)
  console.log(`  Video files: ${videoCount}`)
  console.log(`  Image files: ${totalItems - videoCount}`)
  
  if (videoCount === 0) {
    console.log('\n💡 No video files found. To test video functionality:')
    console.log('  1. Visit http://localhost:3000/test-video for local testing')
    console.log('  2. Upload .mp4 or .mov files to your Backblaze B2 bucket')
    console.log('  3. Supported video formats: mp4, mov, avi, webm, mkv, m4v')
  } else {
    console.log('\n✅ Video files found! Check the main site for video functionality.')
  }
}

// Run the script
checkForVideos().catch(console.error) 