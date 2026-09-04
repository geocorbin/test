import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { RecipeDetail } from './RecipeDetail'
import { renderWithProviders } from '../test/renderWithProviders'
import * as recipesApi from '../api/recipes'
import type { Recipe } from '../types'

vi.mock('../api/recipes')

const recipe: Recipe = {
  _id: '1',
  title: 'Chickpea Stew',
  description: 'A warm stew.',
  image: '',
  ingredients: [{ name: 'Chickpeas', quantity: '1 can' }],
  instructions: [{ step: 1, description: 'Simmer everything.' }],
  tags: ['Vegan'],
  ownerId: 'owner-1',
  createdAt: '2025-02-13T12:00:00.000Z',
}

describe('RecipeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the recipe title, ingredients, instructions, and tags', async () => {
    vi.mocked(recipesApi.getRecipe).mockResolvedValueOnce(recipe)
    renderWithProviders(<RecipeDetail />, { route: '/recipes/1', path: '/recipes/:id' })

    expect(await screen.findByRole('heading', { name: 'Chickpea Stew', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('1 can Chickpeas')).toBeInTheDocument()
    expect(screen.getByText('Simmer everything.')).toBeInTheDocument()
    expect(screen.getByText('Vegan')).toBeInTheDocument()
  })

  it('shows a not-found message when the recipe fails to load', async () => {
    vi.mocked(recipesApi.getRecipe).mockRejectedValueOnce(new Error('not found'))
    renderWithProviders(<RecipeDetail />, { route: '/recipes/1', path: '/recipes/:id' })

    expect(await screen.findByText("We couldn't find that recipe.")).toBeInTheDocument()
  })
})
