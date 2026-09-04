export interface User {
  _id: string
  email: string
}

export interface Ingredient {
  name: string
  quantity: string
}

export interface Instruction {
  step: number
  description: string
}

export interface Recipe {
  _id: string
  title: string
  description?: string
  image?: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags: string[]
  ownerId: string
  createdAt: string
}

export interface RecipeInput {
  title: string
  description: string
  image: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags: string[]
}

export interface AuthResponse {
  token: string
}
