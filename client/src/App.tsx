import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BrowseRecipes from './pages/BrowseRecipes';
import RecipePage from './pages/RecipePage';
import GroceryListPage from './pages/GroceryListPage';
import { useEffect, useState } from 'react';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/Login';
import { Auth, SavedRecipesList, UserGroceryList } from './lib/dataTypes';
import { AppContext } from './components/AppContext';
import SavedRecipesPage from './pages/SavedRecipesPage';
import {
  fetchAddToSavedRecipesList,
  fetchRemoveSavedRecipe,
  fetchSavedRecipes,
} from './lib/api';
// import LoadingMessage from './components/LoadingMessage';

const tokenKey = 'react-context-jwt';

export default function App() {
  const [user, setUser] = useState<UserGroceryList>();
  const [token, setToken] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedRecipesList, setSavedRecipesList] = useState<SavedRecipesList>({
    savedRecipesListId: 0,
    userId: 0,
    savedRecipeItems: [],
  });

  useEffect(() => {
    console.log('app use effect fired');
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth);
      setUser(a.user);
      setToken(a.token);
    }
  }, []);

  // console.log('rendering app', isLoading);
  // if (isLoading) {
  //   return <LoadingMessage />;
  // }

  function handleSignIn(auth: Auth) {
    localStorage.setItem(tokenKey, JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
  }

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setUser(undefined);
    setToken(undefined);
    console.log('Signed out');
  }

  async function handleHeartClick(recipeId: number, user: UserGroceryList) {
    if (user) {
      const savedRecipes = await fetchSavedRecipes(user.savedRecipesListId);
      const savedRecipesListId = user.savedRecipesListId;
      // Check if the recipe is already in the saved list
      const isRecipeSaved = savedRecipes.savedRecipeItems.find(
        (recipe) => recipe.recipeId === recipeId
      );
      if (isRecipeSaved === undefined) {
        // If not saved, add it to the saved list
        await fetchAddToSavedRecipesList({ recipeId, savedRecipesListId });
      } else {
        // If already saved, remove it from the saved list
        await fetchRemoveSavedRecipe({ recipeId, savedRecipesListId });
      }
    } else {
      alert('You must be signed in to save a recipe');
    }
  }

  const contextValue = {
    user,
    token,
    isLoading,
    isSaved,
    handleSignIn,
    handleSignOut,
    savedRecipesList,
    handleHeartClick,
    setIsLoading,
    setIsSaved,
    setSavedRecipesList,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route
          path="/"
          element={
            <Header
              groceryListId={user?.groceryListId}
              savedRecipesListId={user?.savedRecipesListId}
            />
          }>
          <Route index element={<BrowseRecipes />} />
          <Route
            path="recipes/:recipeId"
            element={<RecipePage groceryListId={user?.groceryListId} />}
          />
          <Route
            path="grocery-list/:groceryListId"
            element={<GroceryListPage />}
          />
          <Route
            path="saved-recipes/:savedRecipesListId"
            element={<SavedRecipesPage />}
          />
          <Route path="auth/sign-up" element={<RegistrationForm />} />
          <Route path="auth/login" element={<LoginForm />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}
