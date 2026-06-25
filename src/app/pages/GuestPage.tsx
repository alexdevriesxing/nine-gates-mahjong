import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestPage() {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    loginAsGuest();
    navigate('/play', { replace: true });
  }, [loginAsGuest, navigate]);
  return <div className="container-wide py-32 text-center"><div className="tile-spinner mx-auto mb-4" /><p>Opening a guest table…</p></div>;
}
