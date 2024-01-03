import { createContext } from 'react';
import { Auth, SavedRecipesList, UserGroceryList } from '../lib/dataTypes';

type AppContextValues = {
  user: UserGroceryList | undefined;
  token: string | undefined;
  savedRecipesList: SavedRecipesList;
  handleSignIn: (auth: Auth) => void;
  handleSignOut: () => void;
  handleHeartClick: (
    recipeId: number,
    user: UserGroceryList,
    solidHeart: boolean
  ) => void;
  setSavedRecipesList: (savedRecipesList: SavedRecipesList) => void;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  savedRecipesList: { savedRecipesListId: 0, userId: 0, savedRecipeItems: [] },
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
  handleHeartClick: () => undefined,
  setSavedRecipesList: () => undefined,
});
