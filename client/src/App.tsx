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
        {/* <Redirect to="browse-recipes" /> */}
        <Route />
      </Route>
    </Routes>
  );
}

// React's Default App.tsx:
// export default function App() {
//   const [serverData, setServerData] = useState('');

//   useEffect(() => {
//     async function readServerData() {
//       const resp = await fetch('/api/hello');
//       const data = await resp.json();

//       console.log('Data from server:', data);

//       setServerData(data.message);
//     }

//     readServerData();
//   }, []);

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank" rel="noreferrer">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>{serverData}</h1>
//     </>
//   );
// }
