import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeList } from './RecipeList'
import { renderWithProviders } from '../test/renderWithProviders'
import * as recipesApi from '../api/recipes'
import type { Recipe } from '../types'

vi.mock('../api/recipes')

const soup: Recipe = {
  _id: '1',
  title: 'Chickpea Stew',
  image: '',
  ingredients: [{ name: 'Chickpeas', quantity: '1 can' }],
  instructions: [],
  tags: ['Vegan'],
  ownerId: 'owner-1',
  createdAt: '2025-02-13T12:00:00.000Z',
}

const salad: Recipe = {
  ...soup,
  _id: '2',
  title: 'Caesar Salad',
  tags: ['Salad'],
  ingredients: [{ name: 'Romaine', quantity: '1 head' }],
}

describe('RecipeList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists all recipes returned by the API', async () => {
    vi.mocked(recipesApi.getAllRecipes).mockResolvedValueOnce([soup, salad])
    renderWithProviders(<RecipeList />)

    expect(await screen.findByRole('heading', { name: 'Chickpea Stew' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Caesar Salad' })).toBeInTheDocument()
  })

  it('filters recipes by search term across title, tags, and ingredients', async () => {
    vi.mocked(recipesApi.getAllRecipes).mockResolvedValueOnce([soup, salad])
    renderWithProviders(<RecipeList />)
    await screen.findByRole('heading', { name: 'Chickpea Stew' })

    await userEvent.type(screen.getByLabelText('Search recipes'), 'romaine')

    expect(screen.getByRole('heading', { name: 'Caesar Salad' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Chickpea Stew' })).not.toBeInTheDocument()
  })

  it('shows a message when no recipes match the search', async () => {
    vi.mocked(recipesApi.getAllRecipes).mockResolvedValueOnce([soup])
    renderWithProviders(<RecipeList />)
    await screen.findByRole('heading', { name: 'Chickpea Stew' })

    await userEvent.type(screen.getByLabelText('Search recipes'), 'nonexistent')

    expect(await screen.findByText("We couldn't find any recipes.")).toBeInTheDocument()
  })
})
