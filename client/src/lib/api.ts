import {
  CheckedRecipeRef,
  GroceryItems,
  GroceryList,
  Ingredient,
  Recipe,
  SavedRecipeItems,
  SavedRecipesList,
  UserGroceryList,
} from './dataTypes.js';

// API caller functions

function handleError(res: Response) {
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch('/api/browse-recipes');
  handleError(res);
  return await res.json();
}

export async function fetchRecipePage(recipeId: number): Promise<Recipe> {
  const res = await fetch(`/api/recipes/${recipeId}`);
  handleError(res);
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
  handleError(res);
  return await res.json();
}

export async function fetchLoginForm(req: object) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  handleError(res);
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
  handleError(res);
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
  handleError(res);
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
  handleError(res);
  return await res.json();
}

export async function fetchCheckedRecipeRef(
  req: object
): Promise<CheckedRecipeRef> {
  const res = await fetch('/api/clicked-recipe-refs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  handleError(res);
  return await res.json();
}

export async function fetchAllCheckedRecipeRef(
  groceryListId: number
): Promise<CheckedRecipeRef[]> {
  const res = await fetch(`/api/clicked-recipe-refs/${groceryListId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
  });
  handleError(res);
  return await res.json();
}

export async function fetchRemoveIngredientIdItems(req: object): Promise<void> {
  const res = await fetch('/api/remove-grocery-items', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  handleError(res);
}

export async function fetchRemoveRecipeIdItems(req: object): Promise<void> {
  // Sends an HTTP request to the server at the endpoint /api/remove-by-recipeId
  const res = await fetch('/api/remove-by-recipeId', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Authenticate using Bearer token
      'Content-type': 'application/json', // Sends in JSON format
    },
    body: JSON.stringify(req), // Converts req object to a string
  });
  handleError(res);
}

export async function fetchRemoveRecipeIngredientsIdItems(
  req: object
): Promise<void> {
  const res = await fetch('/api/remove-by-recipeIngredientsId', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  handleError(res);
}

export async function fetchSavedRecipes(
  savedRecipesListId: number
): Promise<SavedRecipesList> {
  const res = await fetch(`/api/saved-recipes/${savedRecipesListId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  handleError(res);
  return await res.json();
}

export async function fetchAddToSavedRecipesList(
  req: object
): Promise<SavedRecipeItems> {
  const res = await fetch('/api/saved-recipes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  handleError(res);
  return await res.json();
}

export async function fetchRemoveSavedRecipe(req: object): Promise<void> {
  const res = await fetch('/api/remove-saved-recipe', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  handleError(res);
}
