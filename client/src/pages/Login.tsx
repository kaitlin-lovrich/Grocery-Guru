import { FormEvent, useContext } from 'react';
import { fetchLoginForm } from '../lib/api';
import { AppContext } from '../components/AppContext';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  groceryListId: number;
};

export default function LoginForm({ groceryListId }: LoginFormProps) {
  const { handleSignIn } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const { user, token } = await fetchLoginForm(req);
      localStorage.setItem('token', token);
      handleSignIn({ user, token });
      console.log('Signed In', user, '; received token:', token);
      navigate(`../../grocery-list/${groceryListId}`, {
        relative: 'path',
        replace: true,
      });
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <div className="page">
      <div className="content-container form-container">
        <h1 className="page-title form-title">Sign In</h1>
        <form onSubmit={handleSubmit} className="user-auth-form">
          <label>
            Username
            <input type="text" name="username" required />
          </label>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
          <div>
            <button type="submit">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}
