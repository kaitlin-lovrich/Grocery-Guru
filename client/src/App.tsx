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
import { fetchAddToSavedRecipesList, fetchSavedRecipes } from './lib/api';

const tokenKey = 'react-context-jwt';

export default function App() {
  const [user, setUser] = useState<UserGroceryList>();
  const [token, setToken] = useState<string>();
  const [savedRecipesList, setSavedRecipesList] = useState<SavedRecipesList>({
    savedRecipesListId: 0,
    userId: 0,
    savedRecipeItems: [],
  });
  const [solidHeart, setSolidHeart] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth);
      setUser(a.user);
      setToken(a.token);
    }
  }, []);

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
      const found = savedRecipes.savedRecipeItems.find(
        (recipe) => recipe.recipeId === recipeId
      );
      console.log('found', found);
      if (found) return;
      const savedRecipesListId = user.savedRecipesListId;
      console.log('savedRecipesListId', savedRecipesListId);
      await fetchAddToSavedRecipesList({ recipeId, savedRecipesListId });
      // setSolidHeart(true);
    } else {
      alert('You must be signed in to save a recipe');
    }
  }

  const contextValue = {
    user,
    token,
    handleSignIn,
    handleSignOut,
    savedRecipesList,
    solidHeart,
    handleHeartClick,
    setSavedRecipesList,
    setSolidHeart,
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
          <Route />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

// async function handleHeartClick(recipeId: number, user: UserGroceryList) {
//   const found = savedRecipesList.savedRecipeItems.find((recipe) => {
//     console.log('find id:', recipe.recipeId);
//     recipe.recipeId === recipeId;
//   });
//   console.log('recipeId', recipeId);
//   console.log('user', user);
//   console.log(savedRecipesList);
//   console.log('savedRecipeItems', savedRecipesList.savedRecipeItems);
//   console.log('found', found);
//   if (found !== undefined) return;
//   const savedRecipeListId = user.savedRecipesListId;
//   await fetchAddToSavedRecipesList({ recipeId, savedRecipeListId });
// }
