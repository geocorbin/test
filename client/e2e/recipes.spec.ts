import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { test, expect } from '@playwright/test'
import { signUpNewUser } from './fixtures'

const TEST_IMAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'test-image.png')

test.describe('Recipe CRUD', () => {
  test('a creator can create, edit, and delete a recipe', async ({ page }) => {
    await signUpNewUser(page)

    const title = `Test Soup ${Date.now()}`
    await page.getByRole('button', { name: 'Create Recipe' }).click()
    await expect(page.getByRole('heading', { name: 'Create a Recipe' })).toBeVisible()

    await page.getByLabel('Title').fill(title)
    await page.getByLabel(/Ingredients/).fill('Water, 1 cup')
    await page.getByLabel(/Instructions/).fill('Boil the water.')
    await page.getByLabel('Tags').fill('Easy, Vegan')
    await page.getByRole('button', { name: 'Create Recipe' }).click()

    await expect(page.getByText('Your recipe was successfully created.')).toBeVisible()
    await expect(page.getByRole('heading', { name: title })).toBeVisible()

    await page.getByRole('button', { name: 'Edit' }).click()
    const updatedTitle = `${title} Updated`
    await page.getByLabel('Title').fill(updatedTitle)
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Your recipe was successfully updated.')).toBeVisible()
    await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible()

    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Yes, Delete Recipe' }).click()

    await expect(page.getByText('Your recipe was successfully deleted.')).toBeVisible()
    await expect(page.getByRole('heading', { name: updatedTitle })).not.toBeVisible()
  })

  test('a guest can search for and view a public recipe', async ({ page, browser }) => {
    await signUpNewUser(page)
    const title = `Public Recipe ${Date.now()}`

    await page.getByRole('button', { name: 'Create Recipe' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByLabel(/Ingredients/).fill('Eggs, 2')
    await page.getByLabel(/Instructions/).fill('Scramble the eggs.')
    await page.getByRole('button', { name: 'Create Recipe' }).click()
    await expect(page.getByRole('heading', { name: title })).toBeVisible()

    const guestContext = await browser.newContext()
    const guestPage = await guestContext.newPage()
    await guestPage.goto('/recipes')
    await guestPage.getByLabel('Search recipes').fill(title)
    await guestPage.getByRole('link', { name: 'View Recipe' }).click()

    await expect(guestPage.getByRole('heading', { name: title })).toBeVisible()
    await expect(guestPage.getByText('Scramble the eggs.')).toBeVisible()

    await guestContext.close()
  })

  test('a creator can upload an image for a recipe', async ({ page }) => {
    await signUpNewUser(page)
    const title = `Image Test ${Date.now()}`

    await page.getByRole('button', { name: 'Create Recipe' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByLabel(/Ingredients/).fill('Flour, 1 cup')
    await page.getByLabel(/Instructions/).fill('Mix it.')
    await page.getByLabel('Image').setInputFiles(TEST_IMAGE)
    await expect(page.getByAltText('Recipe preview')).toBeVisible()

    await page.getByRole('button', { name: 'Create Recipe' }).click()

    await expect(page.getByText('Your recipe was successfully created.')).toBeVisible()
    await expect(page.getByAltText(title)).toBeVisible()
  })

  test('search shows a "no results" message for an unmatched query', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByLabel('Search recipes').fill(`no-such-recipe-${Date.now()}`)
    await expect(page.getByText("We couldn't find any recipes.")).toBeVisible()
  })
})
