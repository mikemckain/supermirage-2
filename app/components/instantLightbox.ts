export type InstantLightbox = {
  open: (src: string, alt?: string) => void
  close: () => void
}

let overlayEl: HTMLDivElement | null = null
let imgEl: HTMLImageElement | null = null
let isOpen = false

const ensureOverlay = () => {
  if (overlayEl && imgEl) return
  overlayEl = document.createElement('div')
  overlayEl.style.position = 'fixed'
  overlayEl.style.inset = '0'
  overlayEl.style.zIndex = '9999'
  overlayEl.style.display = 'none'
  overlayEl.style.alignItems = 'center'
  overlayEl.style.justifyContent = 'center'
  overlayEl.style.background = 'rgba(0,0,0,0.9)'
  overlayEl.style.cursor = "url('/assets/icons/cursor3.png') 8 8, auto"

  imgEl = document.createElement('img')
  imgEl.style.maxWidth = '90vw'
  imgEl.style.maxHeight = '90vh'
  imgEl.style.width = 'auto'
  imgEl.style.height = 'auto'
  imgEl.style.objectFit = 'contain'

  overlayEl.appendChild(imgEl)
  document.body.appendChild(overlayEl)

  overlayEl.addEventListener('click', () => {
    api.close()
  })
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') api.close()
}

export const api: InstantLightbox = {
  open: (src: string, alt?: string) => {
    if (typeof window === 'undefined') return
    ensureOverlay()
    if (!overlayEl || !imgEl) return

    imgEl.src = src
    imgEl.alt = alt || ''

    overlayEl.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    if (!isOpen) {
      document.addEventListener('keydown', onKeyDown)
    }
    isOpen = true
  },
  close: () => {
    if (!overlayEl) return
    overlayEl.style.display = 'none'
    document.body.style.overflow = ''
    if (isOpen) {
      document.removeEventListener('keydown', onKeyDown)
    }
    isOpen = false
  },
} 