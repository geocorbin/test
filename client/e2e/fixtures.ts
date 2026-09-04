import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export interface TestUser {
  email: string
  password: string
}

export function generateTestUser(): TestUser {
  const unique = Date.now() + Math.floor(Math.random() * 10000)
  return {
    email: `e2e-user-${unique}@example.com`,
    password: 'password123',
  }
}

export async function signUpNewUser(page: Page): Promise<TestUser> {
  const user = generateTestUser()
  await page.goto('/signup')
  await page.getByLabel('Username').fill(user.email)
  await page.getByLabel('Password').fill(user.password)
  await page.getByRole('button', { name: 'Create Account' }).click()
  await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible()
  return user
}
