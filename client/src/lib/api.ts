import { GroceryList, Recipe } from './dataTypes.js';

// tried to do try catch but got an error underlining Promise<Recipe[]>
export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch('/api/browse-recipes');
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchRecipePage(recipeId: number): Promise<Recipe> {
  const res = await fetch(`/api/recipes/${recipeId}`);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchGroceryList(
  groceryListId: number
): Promise<GroceryList> {
  const res = await fetch(`/api/grocery-list/${groceryListId}`);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
