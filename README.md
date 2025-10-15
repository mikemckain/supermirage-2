# supermirage

A production-ready personal photo site built with Next.js 14, TypeScript, Tailwind CSS, and Backblaze B2 storage.

## Features

- 📸 **Infinite scroll photo grid** with responsive layout (2-column mobile, 3-column desktop)
- 🎥 **Video autoplay** with intersection observer-based mute/unmute
- 🔀 **Deterministic randomization** with seed-based shuffling
- 🖼️ **Lightbox gallery** with keyboard navigation and focus trapping
- 📱 **Mobile-first responsive design** with perfect square aspect ratios
- ⚡ **Performance optimized** with image preloading and SWR caching
- 🔍 **SEO ready** with proper meta tags and accessibility
- 📊 **Analytics ready** with Plausible integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4
- **Storage**: Backblaze B2 (S3-compatible)
- **Data Fetching**: SWR with infinite loading
- **Testing**: Playwright + Lighthouse CI
- **Deployment**: Vercel

## Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Backblaze B2 credentials:
   ```env
   B2_KEY_ID=your_backblaze_key_id
   B2_APP_KEY=your_backblaze_app_key
   B2_BUCKET=your_bucket_name
   B2_REGION=us-west-004
   B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Backblaze B2 Setup

1. **Create a Backblaze B2 account** and bucket
2. **Make your bucket public** for direct downloads
3. **Generate application keys** with read access
4. **Upload your media files** to the bucket
5. **Configure environment variables** as shown above

### Important Notes

- Your Backblaze bucket **must be public** for direct `https://<bucket>.s3.<region>.backblazeb2.com/<key>` downloads
- Supported file types: Images (jpg, png, gif, webp) and Videos (mp4, mov)
- Files are served directly from Backblaze without signed URLs

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```bash
   vercel env pull  # Pull from Vercel dashboard
   ```
3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the project**:
   ```bash
   pnpm build
   ```

2. **Start production server**:
   ```bash
   pnpm start
   ```

## Testing

### Playwright Tests
```bash
pnpm test
```

### Lighthouse CI
```bash
pnpm build
pnpm start
pnpm lhci
```

## Project Structure

```
app/
├── layout.tsx              # Root layout with analytics
├── page.tsx                # Main page component
├── globals.css             # Global styles and Tailwind
├── components/
│   ├── Header.tsx          # Fixed header with logo and social links
│   ├── Grid.tsx            # Responsive media grid with infinite scroll
│   ├── MediaCell.tsx       # Individual media item (image/video)
│   ├── Lightbox.tsx        # Modal gallery with navigation
│   └── RandomizeButton.tsx # Shuffle button with spiral icon
├── hooks/
│   ├── useInfiniteMedia.ts # SWR infinite scroll hook
│   └── useVideoAutoplay.ts # Video intersection observer hook
└── api/
    └── media/route.ts      # Backblaze B2 proxy API

lib/
├── backblaze.ts            # S3 client configuration
└── shuffle.ts              # Deterministic array shuffling

tests/
└── homepage.spec.ts        # Playwright test suite
```

## Performance Features

- **Image optimization** with Next.js Image component
- **Lazy loading** with intersection observers
- **Infinite scroll** with 60vh preload margin
- **Video autoplay** only when 50%+ visible
- **Deterministic caching** with SWR revalidation
- **Preloading** of adjacent lightbox images

## Accessibility

- **Keyboard navigation** for all interactive elements
- **Focus trapping** in lightbox modal
- **ARIA labels** for screen readers
- **Semantic HTML** structure
- **Color contrast** compliance

## Browser Support

- **Modern browsers** with ES2020+ support
- **Mobile Safari** with video autoplay policies
- **Chrome/Firefox/Safari** desktop and mobile

## License

MIT License - feel free to use for personal or commercial projects. 