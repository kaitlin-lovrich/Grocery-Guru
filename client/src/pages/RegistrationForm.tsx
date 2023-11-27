import { FormEvent } from 'react';
import { fetchRegistrationForm } from '../lib/api';
import './Forms.css';
import { useNavigate } from 'react-router-dom';

export default function RegistrationForm() {
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const { ...user } = await fetchRegistrationForm(userData);
      console.log('Registered', user);

      navigate('../../auth/login/', {
        relative: 'path',
        replace: true,
      });
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }

  return (
    <div className="page form-page">
      <div className="content-container form-container">
        <h2 className="page-title form-title">Sign Up</h2>
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
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
