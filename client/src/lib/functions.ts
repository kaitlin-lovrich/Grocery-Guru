import { RecipeIngredient } from './dataTypes';

export function formatRecipeIngredient(ingredient: RecipeIngredient) {
  if (
    ingredient.measurement === 'ounce' ||
    (ingredient.measurement === 'slice' && ingredient.quantity <= 1)
  ) {
    return `${ingredient.quantity} ${ingredient.measurement} ${ingredient.name}`;
  } else if (
    ingredient.measurement === 'ounce' ||
    (ingredient.measurement === 'slice' &&
      ingredient.quantity >= 1 &&
      ingredient.name.slice(-1) === 's')
  ) {
    return `${ingredient.quantity} ${ingredient.measurement} ${ingredient.name}`;
  } else if (
    ingredient.measurement === 'ounce' ||
    (ingredient.measurement === 'slice' && ingredient.quantity >= 1)
  ) {
    return `${ingredient.quantity} ${ingredient.measurement}s ${ingredient.name}`;
  } else if (
    !ingredient.measurement.length ||
    (!ingredient.packageType.length && ingredient.quantity <= 1)
  ) {
    return `${ingredient.quantity} ${ingredient.name}`;
  } else if (
    !ingredient.measurement.length ||
    (!ingredient.packageType.length &&
      ingredient.quantity >= 1 &&
      ingredient.name.slice(-1) === 's')
  ) {
    return `${ingredient.quantity} ${ingredient.name}`;
  } else if (
    !ingredient.measurement.length ||
    (!ingredient.packageType.length && ingredient.quantity >= 1)
  ) {
    return `${ingredient.quantity} ${ingredient.name}s`;
  }
  // else if (!ingredient.measurement.length && ingredient.quantity < 1) {
  //   return `${ingredient.quantity} ${ingredient.name}`;
  // } else if (
  //   !ingredient.measurement.length &&
  //   ingredient.quantity > 1 &&
  //   ingredient.name.slice(-1) === 's'
  // ) {
  //   return `${ingredient.quantity} ${ingredient.name}`;
  // } else if (!ingredient.measurement.length && ingredient.quantity > 1) {
  //   return `${ingredient.quantity} ${ingredient.name}`;
  // }
}
