import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, GuestSession } from '@shared/types';
import { generateGuestName } from '@shared/utils';

interface AuthContextType {
  user: User | null;
  guestSession: GuestSession | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateAvatar: (tileKey: string) => Promise<void>;
  displayName: string;
  avatarTile: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY_GUEST = 'ngm_guest';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [guestSession, setGuestSession] = useState<GuestSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GUEST);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/profile', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ user: User }>;
      })
      .then((payload) => {
        if (!cancelled) {
          setUser(payload?.user ?? null);
          if (payload?.user) setGuestSession(null);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (guestSession && !user) {
      localStorage.setItem(STORAGE_KEY_GUEST, JSON.stringify(guestSession));
    } else if (!guestSession) {
      localStorage.removeItem(STORAGE_KEY_GUEST);
    }
  }, [guestSession, user]);

  const isAuthenticated = user !== null;
  const isGuest = guestSession !== null && user === null;
  const isLoggedIn = isAuthenticated || isGuest;
  const displayName = user?.displayName || guestSession?.guestName || 'Player';
  const avatarTile = user?.avatarTile || guestSession?.avatarTile || 'dragons:red';

  const updateAvatar = useCallback(async (tileKey: string) => {
    if (user) {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarTile: tileKey }),
      });
      const payload = await response.json() as { user?: User; error?: string };
      if (!response.ok || !payload.user) throw new Error(payload.error || 'Avatar update failed.');
      setUser(payload.user);
    } else if (guestSession) {
      setGuestSession({ ...guestSession, avatarTile: tileKey });
    }
  }, [user, guestSession]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json() as { user?: User; error?: string };
    if (!response.ok || !payload.user) throw new Error(payload.error || 'Login failed.');
    setUser(payload.user);
    setGuestSession(null);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const payload = await response.json() as { user?: User; error?: string };
      if (!response.ok || !payload.user) throw new Error(payload.error || 'Registration failed.');
      setUser(payload.user);
      setGuestSession(null);
    },
    []
  );

  const loginAsGuest = useCallback(() => {
    const defaultAvatars = ['dragons:red', 'dragons:green', 'dragons:white', 'winds:east', 'winds:south', 'bamboo:1', 'circles:1', 'characters:1', 'characters:9'];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const session: GuestSession = {
      id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      guestName: generateGuestName(),
      createdAt: new Date().toISOString(),
      avatarTile: randomAvatar
    };
    setGuestSession(session);
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    void fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setGuestSession(null);
    localStorage.removeItem(STORAGE_KEY_GUEST);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        guestSession,
        isAuthenticated,
        isGuest,
        isLoggedIn,
        login,
        register,
        loginAsGuest,
        logout,
        updateAvatar,
        displayName,
        avatarTile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
