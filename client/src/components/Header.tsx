import { useContext } from 'react';
import './Header.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

type HeaderProps = {
  groceryListId: number | undefined;
  savedRecipesListId: number | undefined;
};

export default function Header({
  groceryListId,
  savedRecipesListId,
}: HeaderProps) {
  const { user, handleSignOut } = useContext(AppContext);
  const navigate = useNavigate();

  function handleNavLogOut() {
    navigate('../../', {
      relative: 'path',
      replace: true,
    });
    handleSignOut();
  }

  function handleGroceryListClick() {
    if (!user?.groceryListId) {
      navigate('../../auth/login', {
        relative: 'path',
        replace: true,
      });
    } else {
      navigate(`../../grocery-list/${groceryListId}`, {
        relative: 'path',
        replace: true,
      });
    }
  }

  function handleSavedRecipesClick() {
    if (!user?.savedRecipesListId) {
      navigate('../../auth/login', {
        relative: 'path',
        replace: true,
      });
    } else {
      navigate(`../../saved-recipes/${savedRecipesListId}`, {
        relative: 'path',
        replace: true,
      });
    }
  }

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
              <Link to="">{`Hi ${user?.username} `}</Link> // link to user profile eventually
            ) : (
              <Link to="auth/sign-up">Sign Up</Link>
            )}
          </li>
          <li>
            {user ? (
              <a onClick={handleNavLogOut}>Logout</a>
            ) : (
              <Link to="auth/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>

      <div className="sub-header">
        <div className="nav3buttons">
          <ul>
            <li>
              <a onClick={handleGroceryListClick}>GroceryList</a>
            </li>
            <li>
              <a onClick={handleSavedRecipesClick}>Saved Recipes</a>
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
