export type User = {
  userId: number;
  userAvatar: string;
  username: string;
  password: string;
  createdAt: any;
};

export type Recipe = {
  recipeId: number;
  userId: number;
  title: string;
  description: string;
  recipeImage: string;
  instructions: string;
  createdAt: string;
};

export type GroceryList = {
  grocerListId: number;
  userId: number;
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
  quantity: string;
};

export type GroceryItems = {
  groceryItemsId: number;
  groceryListId: number;
  ingredientId: number;
};
