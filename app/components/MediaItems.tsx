'use client'

import { useEffect, useState } from 'react'
import { MediaCell } from './MediaCell'
import { useInfiniteMedia } from '@/app/hooks/useInfiniteMedia'
import { MediaItem } from '@/app/api/media/route'

interface MediaItemsProps {
  sentinelRef: React.RefObject<HTMLDivElement>
}

export const MediaItems = ({ sentinelRef }: MediaItemsProps) => {
  const [nonce, setNonce] = useState(0)
  const { media, isLoadingMore, isReachingEnd, loadMore } = useInfiniteMedia(nonce)

  // Intersection observer for infinite scroll (using sentinel provided by parent Grid)
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !isLoadingMore && !isReachingEnd) {
          loadMore()
        }
      },
      {
        rootMargin: '600px 0px',
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.unobserve(sentinel)
    }
  }, [isLoadingMore, isReachingEnd, loadMore, media.length, sentinelRef])

  // Listen for global reshuffle events to bump the nonce and refetch a new order
  useEffect(() => {
    const onReshuffle = () => setNonce((n) => n + 1)
    window.addEventListener('supermirage:reshuffle', onReshuffle as EventListener)
    return () => window.removeEventListener('supermirage:reshuffle', onReshuffle as EventListener)
  }, [])

  const noop = () => {}

  return (
    <>
      {media.map((item: MediaItem, index: number) => (
        <MediaCell key={`${item.key}-${index}`} item={item} onClick={noop} />
      ))}
    </>
  )
}


