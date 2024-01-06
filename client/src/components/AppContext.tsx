import { createContext } from 'react';
import { Auth, SavedRecipesList, UserGroceryList } from '../lib/dataTypes';

type AppContextValues = {
  user: UserGroceryList | undefined;
  token: string | undefined;
  isLoading: boolean;
  isSaved: boolean;
  savedRecipesList: SavedRecipesList;
  handleSignIn: (auth: Auth) => void;
  handleSignOut: () => void;
  handleHeartClick: (
    recipeId: number,
    user: UserGroceryList,
    solidHeart: boolean
  ) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSaved: (saved: boolean) => void;
  setSavedRecipesList: (savedRecipesList: SavedRecipesList) => void;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  isLoading: true,
  isSaved: false,
  savedRecipesList: { savedRecipesListId: 0, userId: 0, savedRecipeItems: [] },
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
  handleHeartClick: () => undefined,
  setIsLoading: () => undefined,
  setIsSaved: () => undefined,
  setSavedRecipesList: () => undefined,
});
