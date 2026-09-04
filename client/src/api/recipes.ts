import apiClient from './client'
import type { Recipe, RecipeInput } from '../types'

export async function getAllRecipes(): Promise<Recipe[]> {
  const { data } = await apiClient.get<Recipe[]>('/recipes')
  return data
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data } = await apiClient.get<Recipe>(`/recipes/${id}`)
  return data
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const { data } = await apiClient.post<Recipe>('/recipes', input)
  return data
}

export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  const { data } = await apiClient.put<Recipe>(`/recipes/${id}`, input)
  return data
}

export async function deleteRecipe(id: string): Promise<void> {
  await apiClient.delete(`/recipes/${id}`)
}
