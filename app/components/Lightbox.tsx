'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { MediaItem } from '@/app/api/media/route'
import { getDownloadUrl } from '@/lib/backblaze'

interface LightboxProps {
  item: MediaItem
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  preloadNext?: MediaItem
  preloadPrev?: MediaItem
}

const customLoader = ({ src }: { src: string }) => {
  return getDownloadUrl(src)
}

export const Lightbox = ({ 
  item, 
  onClose, 
  onNext, 
  onPrev, 
  preloadNext, 
  preloadPrev 
}: LightboxProps) => {
  const backdropRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Focus trap
  useEffect(() => {
    if (item.type !== 'image') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
      if (event.key === 'ArrowRight' && onNext) {
        onNext()
      }
      if (event.key === 'ArrowLeft' && onPrev) {
        onPrev()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    // Focus the content container
    contentRef.current?.focus()

    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [item.type, onClose, onNext, onPrev])

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === backdropRef.current) {
      onClose()
    }
  }

  const altText = item.key.split('/').pop()?.split('.')[0] || 'Media'

  // Guard: do not render lightbox for non-image items
  if (item.type !== 'image') {
    return null
  }

  const lightboxContent = (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className="relative h-auto max-h-[90vh] w-auto max-w-[90vw]"
        tabIndex={-1}
        role="dialog"
        aria-label={`Lightbox: ${altText}`}
      >
        <Image
          loader={customLoader}
          src={item.key}
          alt={altText}
          width={1200}
          height={1200}
                      className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
          priority
        />
        
        
      </div>
      
      {/* Preload adjacent images */}
      {preloadNext && preloadNext.type === 'image' && (
        <Image
          loader={customLoader}
          src={preloadNext.key}
          alt=""
          width={1}
          height={1}
          className="pointer-events-none absolute opacity-0"
          priority
        />
      )}
      {preloadPrev && preloadPrev.type === 'image' && (
        <Image
          loader={customLoader}
          src={preloadPrev.key}
          alt=""
          width={1}
          height={1}
          className="pointer-events-none absolute opacity-0"
          priority
        />
      )}
    </div>
  )

  return createPortal(lightboxContent, document.body)
} 