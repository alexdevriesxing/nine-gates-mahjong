import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <SEOHead title="Create a Mahjong Profile | Nine Gates Mahjong" description="Register a free Nine Gates Mahjong profile for ratings, Hall of Fame wins, daily streaks, multiplayer rooms, and events." canonical="https://ninegatesmahjong.com/register" noIndex />
      <main className="account-page">
        <form onSubmit={async (event) => {
          event.preventDefault();
          if (username.trim().length < 3) return setError('Choose a display name with at least three characters.');
          if (!email.includes('@')) return setError('Enter a valid email.');
          if (password.length < 10) return setError('Use at least ten password characters.');
          setError('');
          setSubmitting(true);
          try {
            await register(username.trim(), email, password);
            navigate('/profile');
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Registration failed.');
          } finally {
            setSubmitting(false);
          }
        }}>
          <div className="account-seal">龍</div>
          <p className="game-eyebrow">Enter the Hall of Fame</p>
          <h1>Create profile</h1>
          <label>Display name<input className="input-nine" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>
          <label>Email<input className="input-nine" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
          <label>Password<input className="input-nine" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label>
          {error && <p className="account-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? 'Creating profile…' : 'Create free profile'}</button>
          <small>Your password is protected with a salted server-side hash and is never stored in plain text.</small>
          <p>Already registered? <Link to="/login">Log in</Link>.</p>
        </form>
      </main>
    </>
  );
}
