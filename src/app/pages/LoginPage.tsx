import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <SEOHead title="Log In | Nine Gates Mahjong" description="Log in to your Nine Gates profile to save ratings, wins, streaks, and tournament records." canonical="https://ninegatesmahjong.com/login" />
      <main className="account-page">
        <form onSubmit={async (event) => {
          event.preventDefault();
          if (!email.includes('@') || password.length < 8) return setError('Enter a valid email and at least eight password characters.');
          try {
            await login(email, password);
            navigate('/profile');
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Login failed.');
          }
        }}>
          <div className="account-seal">門</div>
          <p className="game-eyebrow">Return to the table</p>
          <h1>Log in</h1>
          <label>Email<input className="input-nine" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
          <label>Password<input className="input-nine" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
          {error && <p className="account-error">{error}</p>}
          <button className="btn-primary" type="submit">Log in</button>
          <p>New to Nine Gates? <Link to="/register">Create a profile</Link>.</p>
        </form>
      </main>
    </>
  );
}
