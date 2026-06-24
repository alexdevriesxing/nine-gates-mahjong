import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, GuestSession } from '@shared/types';
import { generateGuestName } from '@shared/utils';

// =====================================================
// Auth Context — Manages user state (registered, guest, or anonymous)
// TODO: Connect to Cloudflare Worker auth endpoints for production
// =====================================================

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
  updateAvatar: (tileKey: string) => void;
  displayName: string;
  avatarTile: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY_USER = 'ngm_user';
const STORAGE_KEY_GUEST = 'ngm_guest';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [guestSession, setGuestSession] = useState<GuestSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GUEST);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.removeItem(STORAGE_KEY_GUEST);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

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

  const updateAvatar = useCallback((tileKey: string) => {
    if (user) {
      setUser({ ...user, avatarTile: tileKey });
    } else if (guestSession) {
      setGuestSession({ ...guestSession, avatarTile: tileKey });
    }
  }, [user, guestSession]);

  const login = useCallback(async (email: string, _password: string) => {
    // TODO: POST /api/auth/login — validate credentials via Cloudflare Worker
    // TODO: Never store plaintext passwords — use bcrypt/argon2 on the server
    const mockUser: User = {
      id: `user-${Date.now()}`,
      username: email.split('@')[0],
      displayName: email.split('@')[0],
      email,
      isGuest: false,
      avatarTile: 'dragons:red',
      level: 1,
      xp: 0,
      coins: 100,
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setGuestSession(null);
  }, []);

  const register = useCallback(
    async (username: string, email: string, _password: string) => {
      // TODO: POST /api/auth/register — hash password server-side
      // TODO: Validate username uniqueness, email format, password strength
      const mockUser: User = {
        id: `user-${Date.now()}`,
        username,
        displayName: username,
        email,
        isGuest: false,
        avatarTile: 'dragons:red',
        level: 1,
        xp: 0,
        coins: 100,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
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
    setUser(null);
    setGuestSession(null);
    localStorage.removeItem(STORAGE_KEY_USER);
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
