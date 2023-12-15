import { createContext } from 'react';
import { Auth, SavedRecipesList, UserGroceryList } from '../lib/dataTypes';

type AppContextValues = {
  user: UserGroceryList | undefined;
  token: string | undefined;
  savedRecipesList: SavedRecipesList;
  solidHeart: boolean;
  handleSignIn: (auth: Auth) => void;
  handleSignOut: () => void;
  handleHeartClick: (recipeId: number, user: UserGroceryList) => void;
  setSavedRecipesList: (savedRecipesList: SavedRecipesList) => void;
  setSolidHeart: (bool: boolean) => void;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  savedRecipesList: { savedRecipesListId: 0, userId: 0, savedRecipeItems: [] },
  solidHeart: false,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
  handleHeartClick: () => undefined,
  setSavedRecipesList: () => undefined,
  setSolidHeart: () => undefined,
});
