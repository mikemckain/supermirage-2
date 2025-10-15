'use client'

import { MediaCell } from '../components/MediaCell'
import { MediaItem } from '../api/media/route'

export default function TestVideoPage() {
  const testVideo: MediaItem = {
    key: 'test/test-video.mp4',
    type: 'video'
  }

  const handleClick = () => {
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <h1 className="text-white text-2xl mb-8">Video Functionality Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        <MediaCell item={testVideo} onClick={handleClick} />
      </div>
      
      <div className="mt-8 text-white text-sm">
        <h2 className="text-lg mb-4">Test Instructions:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>The video should start playing when it becomes 50% visible</li>
          <li>It should start muted and then unmute automatically</li>
          <li>Click or press space/enter to toggle mute state</li>
          <li>Check browser console for debug logs</li>
          <li>Look for mute indicator (🔇/🔊) in top-right corner</li>
        </ul>
      </div>
    </main>
  )
} 