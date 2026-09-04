import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { RecipeCard } from '../components/RecipeCard'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../context/AuthContext'
import { getAllRecipes, deleteRecipe } from '../api/recipes'
import type { Recipe } from '../types'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getAllRecipes().then(setRecipes)
  }, [])

  const myRecipes = recipes?.filter((recipe) => recipe.ownerId === user?._id) ?? []

  async function handleConfirmDelete() {
    if (!recipeToDelete || !recipes) return
    await deleteRecipe(recipeToDelete._id)
    setRecipes(recipes.filter((recipe) => recipe._id !== recipeToDelete._id))
    setRecipeToDelete(null)
    setMessage('Your recipe was successfully deleted.')
  }

  return (
    <Layout>
      {message && <p className="toast">{message}</p>}
      <h1>Welcome back!</h1>
      <p className="text-muted">Manage your recipes or add a new one.</p>
      <h2 className="section-title">Your Recipes</h2>

      {recipes === null ? (
        <p>Loading…</p>
      ) : myRecipes.length === 0 ? (
        <div className="empty-box">
          <p className="text-muted">Your recipes will show up here.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {myRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onEdit={(r) => navigate(`/recipes/${r._id}/edit`)}
              onDelete={(r) => setRecipeToDelete(r)}
            />
          ))}
        </div>
      )}

      <button type="button" className="btn btn-primary" onClick={() => navigate('/recipes/new')}>
        Create Recipe
      </button>

      {recipeToDelete && (
        <ConfirmModal
          title="Delete recipe?"
          description="Do you want to delete this recipe? This action cannot be undone."
          confirmLabel="Yes, Delete Recipe"
          onConfirm={handleConfirmDelete}
          onCancel={() => setRecipeToDelete(null)}
        />
      )}
    </Layout>
  )
}
