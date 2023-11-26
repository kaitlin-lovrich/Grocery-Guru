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

export type Recipe = {
  recipeId: number;
  userId: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  recipeImage: string;
  instructions: string;
  createdAt: string;
};

export type GroceryItems = {
  groceryItemsId: number;
  groceryListId: number;
  ingredientId: number;
  quantity: number;
};

export type GroceryList = {
  grocerListId: number;
  userId: number;
  groceryItems: GroceryItems[];
};

export type RecipeIngredient = {
  recipeIngredientsId: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
};

export type Login = {
  username: string;
  password: string;
};
