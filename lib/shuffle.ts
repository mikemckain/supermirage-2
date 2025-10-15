/**
 * Deterministic shuffle using a seed value
 * Based on Fisher-Yates shuffle with seeded random number generator
 */
export const shuffleArray = <T>(array: T[], seed: number): T[] => {
  const shuffled = [...array]
  let currentIndex = shuffled.length
  
  // Simple seeded random number generator (LCG)
  let random = seed
  const nextRandom = () => {
    random = (random * 1664525 + 1013904223) % 4294967296
    return random / 4294967296
  }

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(nextRandom() * currentIndex)
    currentIndex--

    // Swap elements
    ;[shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ]
  }

  return shuffled
}

/**
 * True random shuffle using Math.random()
 * Based on Fisher-Yates shuffle algorithm
 */
export const shuffleArrayRandom = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  let currentIndex = shuffled.length

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // Swap elements
    ;[shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ]
  }

  return shuffled
} 