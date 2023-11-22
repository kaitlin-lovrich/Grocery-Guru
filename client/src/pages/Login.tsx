import { FormEvent } from 'react';
import { fetchLoginForm } from '../lib/api';

type LoginFormProps = {
  setSignedIn: (token: boolean) => void;
};

export default function LoginForm({ setSignedIn }: LoginFormProps) {
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
      sessionStorage.setItem('token', token);
      setSignedIn(!!sessionStorage.getItem('token'));
      console.log('Signed In', user, '; received token:', token);
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
