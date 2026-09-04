import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { getRecipe } from '../api/recipes'
import type { Recipe } from '../types'

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    getRecipe(id)
      .then(setRecipe)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <Layout>
        <p>We couldn&apos;t find that recipe.</p>
        <Link to="/recipes">Back to Recipe List</Link>
      </Layout>
    )
  }

  if (!recipe) {
    return (
      <Layout>
        <p>Loading…</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <nav className="breadcrumb">
        <Link to="/recipes">Recipe List</Link> / <span>{recipe.title}</span>
      </nav>

      {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />}

      <h1>{recipe.title}</h1>
      {recipe.description && <p className="text-muted">{recipe.description}</p>}

      <section className="section">
        <h2>Ingredients</h2>
        <ul className="bulleted-list">
          {recipe.ingredients.map((ingredient) => (
            <li key={`${ingredient.name}-${ingredient.quantity}`}>
              {ingredient.quantity} {ingredient.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Instructions</h2>
        <ol className="numbered-list">
          {recipe.instructions.map((instruction) => (
            <li key={instruction.step}>{instruction.description}</li>
          ))}
        </ol>
      </section>

      {recipe.tags.length > 0 && (
        <section className="section">
          <h2>Tags</h2>
          <div className="tag-list">
            {recipe.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </Layout>
  )
}
