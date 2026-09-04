import { describe, expect, it, vi, beforeEach } from 'vitest'
import apiClient from './client'
import { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } from './recipes'
import type { RecipeInput } from '../types'

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedClient = vi.mocked(apiClient, { deep: true })

const sampleInput: RecipeInput = {
  title: 'Soup',
  description: 'Warm soup',
  image: '',
  ingredients: [{ name: 'Water', quantity: '1 cup' }],
  instructions: [{ step: 1, description: 'Boil it' }],
  tags: ['easy'],
}

describe('recipes api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAllRecipes fetches the recipe collection', async () => {
    mockedClient.get.mockResolvedValueOnce({ data: [] })
    const result = await getAllRecipes()
    expect(mockedClient.get).toHaveBeenCalledWith('/recipes')
    expect(result).toEqual([])
  })

  it('getRecipe fetches a single recipe by id', async () => {
    mockedClient.get.mockResolvedValueOnce({ data: { _id: '1' } })
    const result = await getRecipe('1')
    expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1')
    expect(result).toEqual({ _id: '1' })
  })

  it('createRecipe posts the recipe input', async () => {
    mockedClient.post.mockResolvedValueOnce({ data: { _id: '1', ...sampleInput } })
    await createRecipe(sampleInput)
    expect(mockedClient.post).toHaveBeenCalledWith('/recipes', sampleInput)
  })

  it('updateRecipe puts the recipe input to the id endpoint', async () => {
    mockedClient.put.mockResolvedValueOnce({ data: { _id: '1', ...sampleInput } })
    await updateRecipe('1', sampleInput)
    expect(mockedClient.put).toHaveBeenCalledWith('/recipes/1', sampleInput)
  })

  it('deleteRecipe deletes the recipe by id', async () => {
    mockedClient.delete.mockResolvedValueOnce({ data: {} })
    await deleteRecipe('1')
    expect(mockedClient.delete).toHaveBeenCalledWith('/recipes/1')
  })
})
