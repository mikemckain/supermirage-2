'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { MediaItem } from '@/app/api/media/route'
import { getDownloadUrl } from '@/lib/backblaze'
import { useVideoAutoplay } from '@/app/hooks/useVideoAutoplay'
import { SpinningSpiral } from './SpinningSpiral'
import { api as instantLightbox } from './instantLightbox'

// Simple in-memory cache to avoid redundant decodes per image key
const decodedImageKeyToPromise: Map<string, Promise<void>> = new Map()

const preloadAndDecodeImage = (key: string) => {
  if (typeof window === 'undefined') return
  if (!key) return
  if (decodedImageKeyToPromise.has(key)) return

  const url = getDownloadUrl(key)

  const promise = new Promise<void>((resolve) => {
    const img = new window.Image()
    ;(img as any).decoding = 'async'
    img.src = url

    const finalize = () => resolve()

    if ('decode' in img && typeof (img as any).decode === 'function') {
      ;(img as any).decode().then(finalize).catch(finalize)
    } else {
      img.onload = finalize
      img.onerror = finalize
    }
  })

  decodedImageKeyToPromise.set(key, promise)
}

interface MediaCellProps {
  item: MediaItem
  onClick: () => void
  isActive?: boolean
}

const customLoader = ({ src }: { src: string }) => {
  const url = getDownloadUrl(src)
  return url
}

export const MediaCell = ({ item, onClick, isActive = false }: MediaCellProps) => {
  const { videoRef, isMuted, toggleMute, mute, unmute } = useVideoAutoplay()
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const hoverUnmuteCleanupRef = useRef<(() => void) | null>(null)
  
  // Create alt text from filename with safety checks
  const altText = item?.key?.split('/').pop()?.split('.')[0] || 'Media'

  // Safety check - don't render if item is invalid
  if (!item || !item.key) {
    return null
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      if (item.type === 'video') {
        toggleMute()
      } else {
        // Keyboard activation should open the lightbox for images
        instantLightbox.open(getDownloadUrl(item.key), altText)
      }
    }
  }

  const handleClick = () => {
    if (item.type === 'video') {
      // Click toggles only while hovered (desktop). Always toggles on touch (no hover).
      if (isHovered) {
        toggleMute()
      }
    } else {
      onClick()
    }
  }

  // Tap vs drag detection for images
  const tapStateRef = useRef<{
    active: boolean
    startX: number
    startY: number
    moved: boolean
    pointerId: number | null
    startScrollY: number
  }>({ active: false, startX: 0, startY: 0, moved: false, pointerId: null, startScrollY: 0 })

  const TAP_MOVE_THRESHOLD_PX = 10

  const handlePointerDown = (event: React.PointerEvent) => {
    if (item.type !== 'image') return
    tapStateRef.current.active = true
    tapStateRef.current.pointerId = (event as any).pointerId ?? null
    tapStateRef.current.startX = event.clientX
    tapStateRef.current.startY = event.clientY
    tapStateRef.current.moved = false
    tapStateRef.current.startScrollY = typeof window !== 'undefined' ? (window.scrollY || (window as any).pageYOffset || 0) : 0
  }

  const handlePointerMove = (event: React.PointerEvent) => {
    const s = tapStateRef.current
    if (!s.active) return
    const dx = event.clientX - s.startX
    const dy = event.clientY - s.startY
    if (!s.moved && Math.hypot(dx, dy) > TAP_MOVE_THRESHOLD_PX) {
      s.moved = true
    }
  }

  const handlePointerUp = (event: React.PointerEvent) => {
    const s = tapStateRef.current
    if (!s.active) return
    const scrolled = typeof window !== 'undefined' ? Math.abs((window.scrollY || (window as any).pageYOffset || 0) - s.startScrollY) > 0 : false
    if (!s.moved && !scrolled) {
      // Considered a tap: open the lightbox
      instantLightbox.open(getDownloadUrl(item.key), altText)
    }
    // reset
    s.active = false
    s.pointerId = null
  }

  const handlePointerCancel = () => {
    const s = tapStateRef.current
    s.active = false
    s.pointerId = null
  }

  if (item.type === 'video') {
    return (
      <div 
        className={`no-select no-drag relative aspect-[1/1] overflow-hidden bg-gray-900 ${
          isMuted ? 'cursor-video-muted' : 'cursor-video-unmuted'
        }`}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onClick={(e) => {
          // Ignore synthetic clicks following touch; allow desktop clicks while hovered
          const now = Date.now()
          if ((tapStateRef as any).current?.lastTouchAt && now - (tapStateRef as any).current.lastTouchAt < 500) {
            return
          }
          handleClick()
        }}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          setIsHovered(true)
          const v = videoRef.current
          if (!v) return
          // If already playing and ready, unmute immediately; else wait for next 'playing'
          if (!v.paused && v.readyState >= 2) {
            // Do not auto-unmute on hover; only change cursor
          } else {
            if (!hoverUnmuteCleanupRef.current) {
              const onPlaying = () => {
                // Do not auto-unmute on hover
              }
              v.addEventListener('playing', onPlaying, { once: true })
              hoverUnmuteCleanupRef.current = () => {
                v.removeEventListener('playing', onPlaying as any)
                hoverUnmuteCleanupRef.current = null
              }
            }
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          if (hoverUnmuteCleanupRef.current) {
            hoverUnmuteCleanupRef.current()
          }
          // Always ensure muted on leave
          mute()
        }}
        onPointerDown={(event) => {
          // Touch-only tap detection for videos
          if ((event as any).pointerType !== 'touch') return
          const s = tapStateRef.current
          s.active = true
          s.pointerId = (event as any).pointerId ?? null
          s.startX = event.clientX
          s.startY = event.clientY
          s.moved = false
          s.startScrollY = typeof window !== 'undefined' ? (window.scrollY || (window as any).pageYOffset || 0) : 0
          ;(s as any).lastTouchAt = Date.now()
        }}
        onPointerMove={(event) => {
          const s = tapStateRef.current
          if (!s.active) return
          if ((event as any).pointerType !== 'touch') return
          const dx = event.clientX - s.startX
          const dy = event.clientY - s.startY
          if (!s.moved && Math.hypot(dx, dy) > TAP_MOVE_THRESHOLD_PX) {
            s.moved = true
          }
        }}
        onPointerUp={(event) => {
          const s = tapStateRef.current
          if (!s.active) return
          if ((event as any).pointerType !== 'touch') return
          const scrolled = typeof window !== 'undefined' ? Math.abs((window.scrollY || (window as any).pageYOffset || 0) - s.startScrollY) > 0 : false
          if (!s.moved && !scrolled) {
            toggleMute()
          }
          s.active = false
          s.pointerId = null
        }}
        onPointerCancel={() => {
          const s = tapStateRef.current
          s.active = false
          s.pointerId = null
        }}
        tabIndex={0}
        role="button"
        aria-label={`Video: ${altText}. Press space or enter to toggle mute.`}
      >
        <video
          ref={videoRef}
          src={getDownloadUrl(item.key)}
          playsInline
          muted={isMuted}
          loop
          preload="auto"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className={`no-select no-drag w-full h-full object-cover transition-all duration-500 ${
            videoLoading ? 'opacity-0 scale-80' : 'opacity-100 scale-100'
          }`}
          onLoadStart={() => {
            setVideoLoading(true)
            setVideoError(false)
          }}
          onLoadedData={() => {
            setVideoLoading(false)
          }}
          onError={(e) => {
            setVideoLoading(false)
            setVideoError(true)
          }}
          onProgress={() => {
            // Video is downloading/buffering
          }}
        />
        
        {/* Loading overlay (no spinner) */}
        {videoLoading && !videoError && (
          <div className="absolute inset-0 bg-black" />
        )}
        
        {/* Error overlay */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-sm text-red-400">
            <span>Video failed to load</span>
          </div>
        )}
        
        {/* Mute indicator removed */}
      </div>
    )
  }

  // Don't render anything if the image failed to load
  if (imageError) {
    return null
  }

  // Lifted mode: render the same image elevated and fixed for instant lightbox
  if (isActive) {
    return (
      <>
        {/* Placeholder to avoid layout shift in grid */}
        <div className="no-select no-drag relative aspect-[1/1] bg-black" />
        {/* Lifted image */}
        <div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="no-select no-drag pointer-events-auto" onClick={onClick} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
            <Image
              loader={customLoader}
              src={item.key}
              alt={altText}
              width={1200}
              height={1200}
              className="no-select no-drag h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
              draggable={false}
              priority
            />
          </div>
        </div>
      </>
    )
  }

  // Default grid cell
  return (
    <div 
      className="no-select no-drag cursor-media-cell relative aspect-[1/1] overflow-hidden bg-gray-900"
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => preloadAndDecodeImage(item.key)}
      onFocus={() => preloadAndDecodeImage(item.key)}
      onTouchStart={() => preloadAndDecodeImage(item.key)}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      tabIndex={0}
      role="button"
      aria-label={`Image: ${altText}. Press space or enter to open lightbox.`}
    >
      <Image
        loader={customLoader}
        src={item.key}
        alt={altText}
        fill
        sizes="(max-width: 639px) 50vw, 33vw"
        className={`no-select no-drag object-cover transition-all duration-500 ${
          imageLoading ? 'opacity-0 scale-80' : 'opacity-100 scale-100'
        }`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onLoad={() => {
          setImageLoading(false)
        }}
        onError={(e) => {
          setImageLoading(false)
          setImageError(true)
        }}
      />
      {/* Loading overlay (no spinner) */}
      {imageLoading && (
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  )
} 