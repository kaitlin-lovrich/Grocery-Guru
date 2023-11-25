import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BrowseRecipes from './pages/BrowseRecipes';
import RecipePage from './pages/RecipePage';
import GroceryList from './pages/GroceryList';
import { useEffect, useState } from 'react';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/Login';
import { Auth, User } from './lib/dataTypes';
import { AppContext } from './components/AppContext';

const tokenKey = 'react-context-jwt';

export default function App() {
  const [groceryListId] = useState<number>(1);
  // const [signedIn, setSignedIn] = useState(false);
  const [user, setuser] = useState<User>();
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
        <Route path="/" element={<Header groceryListId={groceryListId} />}>
          <Route index element={<BrowseRecipes />} />
          <Route
            path="recipes/:recipeId"
            element={<RecipePage groceryListId={groceryListId} />}
          />
          <Route path="grocery-list/:groceryListId" element={<GroceryList />} />
          <Route path="auth/sign-up" element={<RegistrationForm />} />
          <Route path="auth/login" element={<LoginForm />} />
          <Route />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

// LoginForm setSignedIn={setSignedIn} setuser={setuser}
// Header signedIn={signedIn} setSignedIn={setSignedIn} user={user as User}
