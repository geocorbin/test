import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RecipeForm } from './RecipeForm'
import { AuthProvider } from '../context/AuthContext'
import * as recipesApi from '../api/recipes'
import * as imageUtils from '../utils/image'
import type { Recipe } from '../types'

vi.mock('../api/recipes')
vi.mock('../utils/image')

function renderForm(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
          <Route path="/dashboard" element={<p>Dashboard Page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('RecipeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the create heading when there is no id in the route', () => {
    renderForm('/recipes/new')
    expect(screen.getByRole('heading', { name: 'Create a Recipe' })).toBeInTheDocument()
  })

  it('shows a validation error when required fields are missing', async () => {
    renderForm('/recipes/new')
    await userEvent.click(screen.getByRole('button', { name: 'Create Recipe' }))
    expect(
      screen.getByText('Please fill in a title, at least one ingredient, and at least one instruction.'),
    ).toBeInTheDocument()
    expect(recipesApi.createRecipe).not.toHaveBeenCalled()
  })

  it('creates a recipe with parsed ingredients and instructions, then navigates to the dashboard', async () => {
    vi.mocked(recipesApi.createRecipe).mockResolvedValueOnce({} as Recipe)
    renderForm('/recipes/new')

    await userEvent.type(screen.getByLabelText('Title'), 'Soup')
    await userEvent.type(screen.getByLabelText(/Ingredients/), 'Water, 1 cup')
    await userEvent.type(screen.getByLabelText(/Instructions/), 'Boil it')
    await userEvent.click(screen.getByRole('button', { name: 'Create Recipe' }))

    expect(recipesApi.createRecipe).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Soup',
        ingredients: [{ name: 'Water', quantity: '1 cup' }],
        instructions: [{ step: 1, description: 'Boil it' }],
      }),
    )
    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument()
  })

  it('loads and prefills an existing recipe in edit mode', async () => {
    const existing: Recipe = {
      _id: '1',
      title: 'Soup',
      description: '',
      image: '',
      ingredients: [{ name: 'Water', quantity: '1 cup' }],
      instructions: [{ step: 1, description: 'Boil it' }],
      tags: [],
      ownerId: 'owner-1',
      createdAt: '2025-02-13T12:00:00.000Z',
    }
    vi.mocked(recipesApi.getRecipe).mockResolvedValueOnce(existing)
    renderForm('/recipes/1/edit')

    expect(await screen.findByDisplayValue('Soup')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Edit Recipe' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('rejects an image that is not PNG or JPG', async () => {
    renderForm('/recipes/new')
    const file = new File(['data'], 'photo.gif', { type: 'image/gif' })

    await userEvent.upload(screen.getByLabelText('Image'), file)

    expect(screen.getByText('Please upload an image in the valid format (PNG, JPG)')).toBeInTheDocument()
    expect(imageUtils.readImageFile).not.toHaveBeenCalled()
  })

  it('rejects an image over 2MB', async () => {
    renderForm('/recipes/new')
    const bigFile = new File([new Uint8Array(3 * 1024 * 1024)], 'photo.png', { type: 'image/png' })

    await userEvent.upload(screen.getByLabelText('Image'), bigFile)

    expect(screen.getByText('Please upload an image less than 2MB')).toBeInTheDocument()
    expect(imageUtils.readImageFile).not.toHaveBeenCalled()
  })

  it('previews a valid image and allows removing it', async () => {
    vi.mocked(imageUtils.readImageFile).mockResolvedValueOnce('data:image/jpeg;base64,mock')
    renderForm('/recipes/new')
    const file = new File(['data'], 'photo.png', { type: 'image/png' })

    await userEvent.upload(screen.getByLabelText('Image'), file)

    expect(await screen.findByAltText('Recipe preview')).toHaveAttribute('src', 'data:image/jpeg;base64,mock')

    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByAltText('Recipe preview')).not.toBeInTheDocument()
  })
})
