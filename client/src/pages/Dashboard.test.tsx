import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dashboard } from './Dashboard'
import { renderWithProviders } from '../test/renderWithProviders'
import { setToken } from '../utils/authStorage'
import * as recipesApi from '../api/recipes'
import type { Recipe } from '../types'

vi.mock('../api/recipes')

function makeToken(userId: string): string {
  const base64url = (obj: object) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_')
  const exp = Math.floor(Date.now() / 1000) + 3600
  return `${base64url({ alg: 'HS256' })}.${base64url({ user: { _id: userId, email: 'a@b.com' }, exp })}.sig`
}

const myRecipe: Recipe = {
  _id: 'r1',
  title: 'My Soup',
  image: '',
  ingredients: [],
  instructions: [],
  tags: [],
  ownerId: 'user-1',
  createdAt: '2025-02-13T12:00:00.000Z',
}

const otherRecipe: Recipe = { ...myRecipe, _id: 'r2', title: 'Someone Else Soup', ownerId: 'user-2' }

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    setToken(makeToken('user-1'))
  })

  it("shows only the logged-in user's recipes", async () => {
    vi.mocked(recipesApi.getAllRecipes).mockResolvedValueOnce([myRecipe, otherRecipe])
    renderWithProviders(<Dashboard />)

    expect(await screen.findByRole('heading', { name: 'My Soup' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Someone Else Soup' })).not.toBeInTheDocument()
  })

  it('shows an empty state when the user has no recipes', async () => {
    vi.mocked(recipesApi.getAllRecipes).mockResolvedValueOnce([otherRecipe])
    renderWithProviders(<Dashboard />)

    expect(await screen.findByText('Your recipes will show up here.')).toBeInTheDocument()
  })

  it('deletes a recipe after confirming', async () => {
    vi.mocked(recipesApi.getAllRecipes).mockResolvedValueOnce([myRecipe])
    vi.mocked(recipesApi.deleteRecipe).mockResolvedValueOnce(undefined)
    renderWithProviders(<Dashboard />)

    await screen.findByRole('heading', { name: 'My Soup' })
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes, Delete Recipe' }))

    expect(recipesApi.deleteRecipe).toHaveBeenCalledWith('r1')
    expect(await screen.findByText('Your recipe was successfully deleted.')).toBeInTheDocument()
  })
})
