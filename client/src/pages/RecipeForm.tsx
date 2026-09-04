import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { createRecipe, getRecipe, updateRecipe } from '../api/recipes'
import { parseTags } from '../utils/tags'
import { readImageFile } from '../utils/image'
import type { Ingredient, Instruction, RecipeInput } from '../types'

function parseIngredients(text: string): Ingredient[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, quantity] = line.split(',').map((part) => part.trim())
      return { name, quantity: quantity || '1' }
    })
}

function parseInstructions(text: string): Instruction[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((description, i) => ({ step: i + 1, description }))
}

function ingredientsToText(ingredients: Ingredient[]): string {
  return ingredients.map((ingredient) => `${ingredient.name}, ${ingredient.quantity}`).join('\n')
}

function instructionsToText(instructions: Instruction[]): string {
  return instructions.map((instruction) => instruction.description).join('\n')
}

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg']

export function RecipeForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [imageError, setImageError] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [instructionsText, setInstructionsText] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    getRecipe(id).then((recipe) => {
      setTitle(recipe.title)
      setDescription(recipe.description ?? '')
      setImage(recipe.image ?? '')
      setIngredientsText(ingredientsToText(recipe.ingredients))
      setInstructionsText(instructionsToText(recipe.instructions))
      setTagsText(recipe.tags.join(', '))
      setIsLoading(false)
    })
  }, [id])

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Please upload an image in the valid format (PNG, JPG)')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Please upload an image less than 2MB')
      return
    }

    setImageError('')
    setImage(await readImageFile(file))
  }

  function handleRemoveImage() {
    setImage('')
    setImageError('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const ingredients = parseIngredients(ingredientsText)
    const instructions = parseInstructions(instructionsText)

    if (!title.trim() || ingredients.length === 0 || instructions.length === 0) {
      setError('Please fill in a title, at least one ingredient, and at least one instruction.')
      return
    }

    const input: RecipeInput = {
      title: title.trim(),
      description: description.trim(),
      image,
      ingredients,
      instructions,
      tags: parseTags(tagsText),
    }

    setIsSubmitting(true)
    setError('')
    try {
      if (isEditing && id) {
        await updateRecipe(id, input)
      } else {
        await createRecipe(input)
      }
      navigate('/dashboard')
    } catch {
      setError('Something went wrong saving your recipe. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <p>Loading…</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <form className="card" onSubmit={handleSubmit}>
        <h1>{isEditing ? 'Edit Recipe' : 'Create a Recipe'}</h1>

        <div className="form-group">
          <label htmlFor="recipe-title">Title</label>
          <input id="recipe-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="recipe-description">Description</label>
          <textarea id="recipe-description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="recipe-ingredients">Ingredients (one per line: Name, Quantity)</label>
          <textarea
            id="recipe-ingredients"
            rows={5}
            placeholder={'Flour, 2 cups\nEggs, 3'}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipe-instructions">Instructions (one step per line)</label>
          <textarea
            id="recipe-instructions"
            rows={5}
            placeholder={'Preheat the oven.\nMix the ingredients.'}
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipe-tags">Tags</label>
          <input
            id="recipe-tags"
            placeholder="Vegan, Dinner, Easy"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipe-image-input">Image</label>
          <input
            id="recipe-image-input"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="visually-hidden"
          />
          {image ? (
            <div className="image-upload">
              <img src={image} alt="Recipe preview" />
            </div>
          ) : (
            <label htmlFor="recipe-image-input" className={`image-upload${imageError ? ' image-upload-error' : ''}`}>
              + Add Image
            </label>
          )}
          {imageError && <p className="form-error">{imageError}</p>}
          {image && (
            <button type="button" className="link-button link-button-danger" onClick={handleRemoveImage}>
              Remove
            </button>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEditing ? 'Save' : 'Create Recipe'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Cancel
        </button>
      </form>
    </Layout>
  )
}
