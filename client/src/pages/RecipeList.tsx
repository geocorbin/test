import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { RecipeCard } from '../components/RecipeCard'
import { getAllRecipes } from '../api/recipes'
import type { Recipe } from '../types'

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getAllRecipes().then(setRecipes)
  }, [])

  const term = query.trim().toLowerCase()
  const filteredRecipes = (recipes ?? []).filter(
    (recipe) =>
      !term ||
      recipe.title.toLowerCase().includes(term) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(term)) ||
      recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(term)),
  )

  return (
    <Layout>
      <h1>Recipe List</h1>
      <input
        type="search"
        aria-label="Search recipes"
        placeholder="Search recipes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {recipes === null ? (
        <p>Loading…</p>
      ) : filteredRecipes.length === 0 ? (
        <p className="text-muted">We couldn&apos;t find any recipes.</p>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </Layout>
  )
}
