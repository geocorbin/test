import { test, expect } from '@playwright/test'

test.describe('Responsive layout', () => {
  test('the login page is usable on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Welcome Back!' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('the recipe list page is usable on a tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/recipes')
    await expect(page.getByRole('heading', { name: 'Recipe List' })).toBeVisible()
    await expect(page.getByLabel('Search recipes')).toBeVisible()
  })

  test('the login page is usable on a desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Welcome Back!' })).toBeVisible()
  })
})
