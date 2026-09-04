import { test, expect } from '@playwright/test'
import { signUpNewUser } from './fixtures'

test.describe('Authentication', () => {
  test('a visitor can sign up and land on the dashboard', async ({ page }) => {
    await signUpNewUser(page)
    await expect(page.getByRole('heading', { name: 'Your Recipes' })).toBeVisible()
  })

  test('a signed up user can log out and log back in', async ({ page }) => {
    const user = await signUpNewUser(page)

    await page.getByRole('link', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Log Out' }).click()
    await expect(page.getByRole('heading', { name: 'Welcome Back!' })).toBeVisible()

    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('heading', { name: 'Your Recipes' })).toBeVisible()
  })

  test('a visitor can browse recipes without logging in', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Explore Recipes without Logging in' }).click()
    await expect(page.getByRole('heading', { name: 'Recipe List' })).toBeVisible()
  })

  test('shows an error for invalid login credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('nonexistent@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Incorrect email or password.')).toBeVisible()
  })

  test('a visitor cannot reach the dashboard without logging in', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Welcome Back!' })).toBeVisible()
  })
})
