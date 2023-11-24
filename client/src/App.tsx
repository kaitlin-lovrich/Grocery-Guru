import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BrowseRecipes from './pages/BrowseRecipes';
import RecipePage from './pages/RecipePage';
import GroceryList from './pages/GroceryList';
import { useState } from 'react';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/Login';
import { User } from './lib/dataTypes';

export default function App() {
  const [groceryListId] = useState<number>(1);
  const [signedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Header
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            currentUser={currentUser as User}
            groceryListId={groceryListId}
          />
        }>
        <Route index element={<BrowseRecipes />} />
        <Route
          path="recipes/:recipeId"
          element={<RecipePage groceryListId={groceryListId} />}
        />
        <Route path="grocery-list/:groceryListId" element={<GroceryList />} />
        <Route path="auth/sign-up" element={<RegistrationForm />} />
        <Route
          path="auth/login"
          element={
            <LoginForm
              setSignedIn={setSignedIn}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route />
      </Route>
    </Routes>
  );
}
