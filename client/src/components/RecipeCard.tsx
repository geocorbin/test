import { Link } from 'react-router-dom'
import type { Recipe } from '../types'
import { formatCreatedDate } from '../utils/date'

interface RecipeCardProps {
  recipe: Recipe
  onEdit?: (recipe: Recipe) => void
  onDelete?: (recipe: Recipe) => void
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      {recipe.image ? (
        <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />
      ) : (
        <div className="recipe-card-image recipe-card-image-empty" />
      )}
      <div className="recipe-card-body">
        <h3>
          <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
        </h3>
        <p className="text-muted text-sm">{formatCreatedDate(recipe.createdAt)}</p>
        <div className="tag-list">
          {recipe.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        {onEdit || onDelete ? (
          <div className="recipe-card-actions">
            {onEdit && (
              <button type="button" className="link-button" onClick={() => onEdit(recipe)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button type="button" className="link-button link-button-danger" onClick={() => onDelete(recipe)}>
                Delete
              </button>
            )}
          </div>
        ) : (
          <Link to={`/recipes/${recipe._id}`} className="recipe-card-link">
            View Recipe
          </Link>
        )}
      </div>
    </article>
  )
}
