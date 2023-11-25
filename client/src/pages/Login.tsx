import { FormEvent, useContext } from 'react';
import { fetchLoginForm } from '../lib/api';
// import { User } from '../lib/dataTypes';
import { AppContext } from '../components/AppContext';

// type LoginFormProps = {
//   setSignedIn: (token: boolean) => void;
//   setuser: (user: User) => void;
// };
// setuser,
// setSignedIn,
// : LoginFormProps

export default function LoginForm() {
  const { handleSignIn } = useContext(AppContext);

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
      // localStorage.setItem('User', user);
      // setSignedIn(!!localStorage.getItem('token'));
      // setuser(user);
      handleSignIn({ user, token });
      console.log('Signed In', user, '; received token:', token);
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
