import { useEffect, useState } from 'react';
import './Header.css';
import { Link, Outlet } from 'react-router-dom';

type HeaderProps = {
  groceryListId: number;
  signedIn: boolean;
  setSignedIn: () => void;
};

export default function Header({ groceryListId }: HeaderProps) {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    setSignedIn(!!sessionStorage.getItem('token'));
  }, [signedIn]);

  return (
    <>
      <nav className="header">
        <Link to="/" className="link-logo">
          <div className="logo">
            <img src="/Grocery-Guru-logo.png" id="logo" />
          </div>
        </Link>

        <ul className="nav-links">
          <li>
            {signedIn ? (
              <Link to="">Hi!</Link>
            ) : (
              <Link to="auth/sign-up">Sign Up</Link>
            )}
          </li>
          <li>
            {signedIn ? <a>Logout</a> : <Link to="auth/login">Login</Link>}
          </li>
        </ul>
      </nav>
      <div className="sub-header">
        <div className="search-bar">
          <p>Search</p>
        </div>
        <div className="nav3buttons">
          <ul>
            <li>
              <Link to={`grocery-list/${groceryListId}`}>GroceryList</Link>
            </li>
            <li>
              <Link to="/saved-recipes">Saved Recipes</Link>
            </li>
            <li>
              <Link to="/">Browse Recipes</Link>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
}
//
//   <div className="navbar-collapse">
//     <p>Hello Kaitlin!</p>
//     <ul className="navbar-nav mr-auto">
//       {/* TODO: Make these links to About and Catalog, with className "title" */}

//       <li className="nav-item nav-link">
//         {/* <Link className="title" to="/about">
//           About
//         </Link> */}
//       </li>
//       <li className="nav-item nav-link">
//         {/* <Link className="title" to="/">
//           Catalog
//         </Link> */}
//       </li>
//     </ul>
//   </div>
// </nav>
// {/* Render the Outlet here. */}
// {/* <Outlet /> */}
