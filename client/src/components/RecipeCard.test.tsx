import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RecipeCard } from './RecipeCard'
import type { Recipe } from '../types'

const recipe: Recipe = {
  _id: '1',
  title: 'Chickpea Stew',
  image: '',
  ingredients: [],
  instructions: [],
  tags: ['Vegan'],
  ownerId: 'owner-1',
  createdAt: '2025-02-13T12:00:00.000Z',
}

describe('RecipeCard', () => {
  it('renders the title, date, and tags', () => {
    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Chickpea Stew' })).toBeInTheDocument()
    expect(screen.getByText('Vegan')).toBeInTheDocument()
  })

  it('shows a View Recipe link when no edit/delete handlers are given', () => {
    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'View Recipe' })).toHaveAttribute('href', '/recipes/1')
  })

  it('calls onEdit and onDelete when their buttons are clicked', async () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} onEdit={onEdit} onDelete={onDelete} />
      </MemoryRouter>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onEdit).toHaveBeenCalledWith(recipe)
    expect(onDelete).toHaveBeenCalledWith(recipe)
  })
})
