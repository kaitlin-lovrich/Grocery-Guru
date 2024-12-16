export type User = {
  userId: number;
  userAvatar: string;
  username: string;
  hashedPassword: string;
  createdAt: any;
};

export type Ingredient = {
  ingredientId: number;
  name: string;
  measurement: string;
  packageType: string;
};

export type RecipeIngredient = {
  recipeIngredientsId: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
};

export type Recipe = {
  recipeId: number;
  userId: number;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  recipeImage: string;
  instructions: string;
  createdAt: string;
};

export type GroceryItems = {
  groceryItemsId: number;
  groceryListId: number;
  recipeId: number;
  ingredientId: number;
  name: string;
  measurement: string;
  packageType: string;
  quantity: number;
};

export type GroceryList = {
  groceryListId: number;
  userId: number;
  groceryItems: GroceryItems[];
};

export type Login = {
  username: string;
  password: string;
};

export type UserGroceryList = User & {
  groceryListId: number;
  savedRecipesListId: number;
};

export type Auth = {
  user: UserGroceryList;
  token: string;
};

export type CheckedRecipeRef = {
  recipeId: number;
  ingredientId: number;
  userId: number;
  title: string;
  recipeImage: string;
  recipeIngredientsId: string;
  quantity: number;
};

export type SavedRecipeItems = Recipe & {
  savedRecipeItems: number;
  savedRecipesListId: number;
  recipeId: number;
};

export type SavedRecipesList = {
  forEach(arg0: (item: any) => any): unknown;
  savedRecipesListId: number;
  userId: number;
  savedRecipeItems: SavedRecipeItems[];
};
