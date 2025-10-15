import { RandomizeButton } from './RandomizeButton'

const TwitterIcon = () => (
<svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.8" d="M27 5.01121C25.9553 5.76409 24.7987 6.33993 23.5745 6.71654C22.9175 5.9447 22.0444 5.39763 21.0731 5.14934C20.1019 4.90104 19.0795 4.9635 18.1441 5.32826C17.2087 5.69302 16.4056 6.34249 15.8433 7.18882C15.2809 8.03515 14.9866 9.03751 15 10.0603V11.1749C13.0829 11.2257 11.1832 10.7913 9.47019 9.91036C7.75717 9.02942 5.18182 6.12581 5.18182 6.12581C5.18182 6.12581 0.818182 16.1572 10.6364 20.6156C8.38967 22.1738 5.71326 22.955 3 22.8448C12.8182 28.4178 24.8182 22.8448 24.8182 10.0269C24.8172 9.71643 24.788 9.40673 24.7309 9.10178C25.8443 7.97993 26.63 6.56352 27 5.01121Z" fill="white"/>
</svg>
)

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export const Header = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <div className="absolute left-1 top-1 flex flex-col items-start gap-1 sm:left-3 sm:top-3">
        <div className="group bg-black p-1">
          <p className="cursor-brand-heart group-hover:animate-hue text-base text-white group-hover:bg-gradient-to-r group-hover:from-red-200 group-hover:via-yellow-200 group-hover:to-blue-200 group-hover:bg-clip-text group-hover:text-transparent">supermirage</p>
        </div>
        <div className="flex flex-col items-center gap-3 p-1">
          <a
            href="https://twitter.com/mmckain_"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-media-cell text-white opacity-50 hover:opacity-100"
            aria-label="Twitter"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://instagram.com/mmckain_"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-media-cell text-white opacity-50 hover:opacity-100"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
      <RandomizeButton />
    </header>
  )
} 