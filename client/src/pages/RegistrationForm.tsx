import { FormEvent } from 'react';
import { fetchRegistrationForm } from '../lib/api';
import './Forms.css';

export default function RegistrationForm() {
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
      const user = await fetchRegistrationForm(req);
      console.log('Registered', user);
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }

  return (
    <div className="page">
      <div className="content-container">
        <h2 className="page-title">Sign Up!</h2>
        <form onSubmit={handleSubmit} className="user-auth-form">
          <label>
            Username
            <input type="text" name="username" required />
          </label>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
