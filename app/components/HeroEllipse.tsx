'use client'

import Image from 'next/image'
import { getDownloadUrl } from '@/lib/backblaze'

const HERO_ELLIPSE_KEY = 'fullsizeoutput_866-3.jpg'

const customLoader = ({ src }: { src: string }) => {
  return getDownloadUrl(src)
}

export const HeroEllipse = () => {
  return (
    <div className="relative cursor-hero-ellipse">
      {/* Ensure container has a concrete height so Next/Image fill can compute layout */}
      <div className="absolute left-1/2 top-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[100%]" style={{ height: '60%' }}>
        <Image
          loader={customLoader}
          src={HERO_ELLIPSE_KEY}
          alt="avi"
          fill
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 30vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
  )
}


