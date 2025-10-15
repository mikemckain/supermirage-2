'use client'

import { Suspense } from 'react'
import { Header } from './components/Header'
import { Grid } from './components/Grid'

function HomeContent() {
  return (
    <div className="pt-0">
      <Grid />
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Suspense 
      fallback={
        <div className="min-h-[50vh] bg-black pt-16" />
      }
      >
        <HomeContent />
      </Suspense>
    </main>
  )
} 