import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BrowseRecipes from './pages/BrowseRecipes';
import RecipePage from './pages/RecipePage';
import GroceryListPage from './pages/GroceryListPage';
import { useEffect, useState } from 'react';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/Login';
import { Auth, UserGroceryList } from './lib/dataTypes';
import { AppContext } from './components/AppContext';
import SavedRecipesPage from './pages/SavedRecipesPage';

const tokenKey = 'react-context-jwt';

export default function App() {
  const [user, setuser] = useState<UserGroceryList>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth);
      setuser(a.user);
      setToken(a.token);
    }
  }, []);

  function handleSignIn(auth: Auth) {
    localStorage.setItem(tokenKey, JSON.stringify(auth));
    setuser(auth.user);
    setToken(auth.token);
  }

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setuser(undefined);
    setToken(undefined);
    console.log('Signed out');
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route
          path="/"
          element={<Header groceryListId={user?.groceryListId} />}>
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
            path="saved-recipes/:savedRecipeListId"
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
