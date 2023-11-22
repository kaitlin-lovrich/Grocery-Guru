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
  const res = await fetch(`/api/grocery-list/${groceryListId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchRegistrationForm(req: object) {
  const res = await fetch('/api/auth/sign-up', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchLoginForm(req: object) {
  const res = await fetch('/api/auth/login', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
