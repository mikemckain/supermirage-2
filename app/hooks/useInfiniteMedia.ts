'use client'

import useSWRInfinite from 'swr/infinite'
import { MediaResponse } from '@/app/api/media/route'

const fetcher = async (url: string): Promise<MediaResponse> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch media')
  }
  return response.json()
}

export const useInfiniteMedia = (nonce: number = 0) => {
  const getKey = (pageIndex: number, previousPageData: MediaResponse | null) => {
    // If we've reached the end, don't fetch more
    if (previousPageData && previousPageData.nextOffset === undefined) return null

    // First page
    if (pageIndex === 0) {
      const params = new URLSearchParams()
      if (nonce) params.set('nonce', String(nonce))
      const qs = params.toString()
      return qs ? `/api/media?${qs}` : `/api/media` // API will generate an order token on first call
    }

    // Subsequent pages: carry forward order and offset
    const params = new URLSearchParams()
    if (nonce) params.set('nonce', String(nonce))
    if (previousPageData?.order) params.set('order', previousPageData.order)
    if (previousPageData?.nextOffset !== undefined) {
      params.set('offset', String(previousPageData.nextOffset))
    }
    return `/api/media?${params.toString()}`
  }

  const { data, error, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  )

  const media = data ? data.flatMap(page => page.items) : []
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.items.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextOffset === undefined)

  return {
    media,
    error,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore: () => setSize(size + 1),
    mutate,
  }
} 