import { GroceryItems, RecipeIngredient } from './dataTypes';

export function formatRecipeIngredient(ingredient: RecipeIngredient) {
  // If Ingredients data looks like (number, name, ounceOrSlice, packageType):
  if (
    ingredient.measurement === 'ounce' ||
    ingredient.measurement === 'slice'
  ) {
    if (ingredient.quantity <= 1 || ingredient.name.slice(-1) === 's') {
      return `${ingredient.quantity} ${ingredient.measurement} ${ingredient.name}`;
    } else if (ingredient.quantity >= 1) {
      return `${ingredient.quantity} ${ingredient.measurement}s ${ingredient.name}`;
    }
    // If Ingredients data looks like (number, name, '', ''):
  } else if (!ingredient.measurement.length || !ingredient.packageType.length) {
    if (ingredient.quantity <= 1 || ingredient.name.slice(-1) === 's') {
      return `${ingredient.quantity} ${ingredient.name}`;
    } else if (ingredient.quantity >= 1) {
      return `${ingredient.quantity} ${ingredient.name}s`;
    }
  }
}

export function formatGroceryListItem(item: GroceryItems) {
  // Handle items that have no specific package type or other package types (e.g., eggplant)
  if (!item.packageType) {
    if (item.quantity === 1) {
      return `${item.quantity} ${item.name}`; // Singular item, no "of"
    } else {
      return `${item.quantity} ${item.name}s`; // Plural item
    }
  } else if (item.packageType !== 'loaf' && item.packageType !== 'seasoning') {
    // Handle non-loaf and non-seasoning package types
    if (item.quantity === 1) {
      return `${item.quantity} ${item.packageType} of ${item.name}`; // singular
    } else {
      return `${item.quantity} ${item.packageType}s of ${item.name}`; // plural
    }
  } else if (item.packageType === 'loaf' || item.packageType === 'seasoning') {
    // Handle loaf and seasoning package types
    if (item.quantity <= 1) {
      if (item.packageType === 'loaf') {
        return `${item.quantity} ${item.packageType} of ${item.name}`; // singular loaf
      } else if (item.packageType === 'seasoning') {
        return `${item.quantity} ${item.name} ${item.packageType}`; // singular seasoning
      }
    } else {
      if (item.packageType === 'loaf') {
        return `${item.quantity} loaves of ${item.name}`; // plural loaves
      } else if (item.packageType === 'seasoning') {
        return `${item.quantity} ${item.name} ${item.packageType}s`; // plural seasoning
      }
    }
    // Fallback for other cases (shouldn't hit this block based on previous checks)
  } else {
    return `${item.quantity} ${item.name}`;
  }
}
