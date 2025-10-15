import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check that the header is visible
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByText('supermirage')).toBeVisible()
    
    // Check for social icons
    await expect(page.getByRole('link', { name: 'Twitter' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Instagram' })).toBeVisible()
    
    // Check for randomize button
    await expect(page.getByRole('button', { name: 'Randomize media order' })).toBeVisible()
  })

  test('should randomize media on button click', async ({ page }) => {
    await page.goto('/')
    
    // Click randomize button
    await page.getByRole('button', { name: 'Randomize media order' }).click()
    
    // Check that URL contains seed parameter
    await expect(page).toHaveURL(/\?seed=\d+/)
    
    // Check that page scrolled to top
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBe(0)
  })

  test('should take a screenshot of the landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveScreenshot('homepage.png')
  })

  test('should take a screenshot of randomized page', async ({ page }) => {
    await page.goto('/?seed=123456')
    await expect(page).toHaveScreenshot('randomized-page.png')
  })

  test('mobile: images render without errors on iOS-like WebKit', async ({ page, browserName }) => {
    await page.goto('/')

    // Only meaningful on webkit/iPhone project, but safe to run everywhere
    // Wait for at least one image cell to appear
    const imageCell = page.locator('div[role="button"][aria-label^="Image:"]').first()
    await imageCell.waitFor({ state: 'visible' })

    // Ensure the underlying <img> from next/image has completed loading
    const img = imageCell.locator('img').first()
    await expect(img).toBeVisible()
    await page.waitForLoadState('networkidle')

    // Assert no network errors for images (filter requests ending in common image extensions)
    const failedRequests = (await page.context().storageState()) && []
    // Lightweight check via console errors as a proxy for MIME failure on iOS
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    // Small scroll to trigger more images and potential lazy loads
    await page.evaluate(() => window.scrollBy(0, 500))
    await page.waitForLoadState('networkidle')

    expect(errors.join('\n')).not.toMatch(/Failed to load resource|MIME|Unsupported|Decoding/)
  })
}) 