'use client'

import { useEffect, useRef, useState } from 'react'

export const useVideoAutoplay = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Video is at least 50% visible - try to play
            
            // First try to play muted (most likely to succeed)
            video.muted = true
            setIsMuted(true)
            
             video.play()
              .then(() => {
                setIsPlaying(true)
              })
              .catch((error) => {
                setIsPlaying(false)
              })
          } else {
            // Video is not sufficiently visible - pause and mute
            video.pause()
            video.muted = true
            setIsMuted(true)
            setIsPlaying(false)
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    observer.observe(video)

    // Add event listeners for video state changes
    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleVolumeChange = () => {
      setIsMuted(video.muted)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      observer.unobserve(video)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  const mute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    setIsMuted(true)
  }

  const unmute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    setIsMuted(false)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    const newMutedState = !video.muted
    video.muted = newMutedState
    setIsMuted(newMutedState)
  }

  return {
    videoRef,
    isMuted,
    isPlaying,
    mute,
    unmute,
    toggleMute,
  }
} 