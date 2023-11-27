import {
  GroceryItems,
  GroceryList,
  Ingredient,
  Recipe,
  UserGroceryList,
} from './dataTypes.js';

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

export async function fetchRegistrationForm(
  req: object
): Promise<UserGroceryList> {
  const res = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchLoginForm(req: object) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchGroceryList(
  groceryListId: number
): Promise<GroceryList> {
  const res = await fetch(`/api/grocery-list/${groceryListId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchAddToGroceryList(
  req: object
): Promise<GroceryItems> {
  const res = await fetch('/api/grocery-list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchAddIngredient(req: object): Promise<Ingredient> {
  const res = await fetch('/api/add-ingredient', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
