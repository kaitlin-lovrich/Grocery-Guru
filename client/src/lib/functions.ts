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
  if (item.packageType !== 'loaf' && item.packageType !== 'seasoning') {
    if (item.quantity <= 1) {
      return `${item.quantity} ${item.packageType} of ${item.name}`;
    } else if (item.quantity >= 1) {
      return `${item.quantity} ${item.packageType}s of ${item.name}`;
    }
  } else if (item.packageType === 'loaf' || item.packageType === 'seasoning') {
    if (item.quantity <= 1) {
      if (item.packageType === 'loaf') {
        return `${item.quantity} ${item.packageType} of ${item.name}`;
      } else if (item.packageType === 'seasoning') {
        return `${item.quantity} ${item.name} ${item.packageType}`;
      }
    } else if (item.quantity >= 1) {
      if (item.packageType === 'loaf') {
        return `${item.quantity} loaves of ${item.name}`;
      } else if (item.packageType === 'seasoning') {
        return `${item.quantity} ${item.name} ${item.packageType}s`;
      }
    }
    // If Ingredients data looks like (number, name, '', ''):
  } else {
    return `${item.quantity} ${item.name}`;
  }
}
