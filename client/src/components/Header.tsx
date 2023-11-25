import { useContext } from 'react';
import './Header.css';
import { Link, Outlet } from 'react-router-dom';
// import { User } from '../lib/dataTypes';
import { AppContext } from './AppContext';

type HeaderProps = {
  groceryListId: number;
  // signedIn: boolean;
  // setSignedIn: (token: boolean) => void;
  // user: User;
};
// setSignedIn
//user

export default function Header({ groceryListId }: HeaderProps) {
  // useEffect(() => {
  //   setSignedIn(!!localStorage.getItem('token'));
  // }, [setSignedIn]);

  // function handleLogout() {
  //   localStorage.removeItem('token');
  //   setSignedIn(false);
  //   console.log('Signed out');
  // }
  const { user, handleSignOut } = useContext(AppContext);

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
            {user ? (
              <Link to="">{`Hi ${user?.username}`}</Link> // link to user profile eventually
            ) : (
              <Link to="auth/sign-up">Sign Up</Link>
            )}
          </li>
          <li>
            {user ? (
              <a onClick={handleSignOut}>Logout</a>
            ) : (
              <Link to="auth/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>

      <div className="sub-header">
        <div className="search-bar-container">
          <div className="search-bar">
            <p>Search</p>
          </div>
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

//   {signedIn ? (
//     <Link to="">{`Hi ${user.username}`}</Link> // link to user profile eventually
//   ) : (
//     <Link to="auth/sign-up">Sign Up</Link>
//   )}
// </li>
// <li>
//   {signedIn ? (
//     <a onClick={handleLogout}>Logout</a>
//   ) : (
//     <Link to="auth/login">Login</Link>
//   )}
