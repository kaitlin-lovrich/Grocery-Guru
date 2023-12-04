import { RecipeIngredient } from './dataTypes';

export function formatRecipeIngredient(ingredient: RecipeIngredient) {
  return `${ingredient.name} ${ingredient.quantity}`;
}
