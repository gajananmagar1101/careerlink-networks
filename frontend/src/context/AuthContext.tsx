import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, type LoginPayload, type RegisterPayload } from '../api/authApi';
import type { AuthResponse, GoogleAuthResponse, Role, User } from '../types/domain';

const TOKEN_KEY = 'careerlink.token';
const USER_KEY = 'careerlink.user';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload, remember?: boolean) => Promise<AuthResponse>;
  loginWithGoogle: (idToken: string, role?: Role, remember?: boolean) => Promise<GoogleAuthResponse>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  dashboardPath: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function storageFor(remember: boolean) {
  return remember ? window.localStorage : window.sessionStorage;
}

function readUser() {
  const raw = window.localStorage.getItem(USER_KEY) ?? window.sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function readToken() {
  return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
}

function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readUser());
  const [token, setToken] = useState<string | null>(() => readToken());
  const navigate = useNavigate();

  const persistSession = useCallback((auth: AuthResponse, options?: { name?: string; remember?: boolean }) => {
    const nextUser: User = {
      id: auth.userId,
      name: options?.name ?? auth.email.split('@')[0],
      email: auth.email,
      role: auth.role
    };
    clearSession();
    const store = storageFor(options?.remember !== false);
    store.setItem(TOKEN_KEY, auth.token);
    store.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(auth.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('careerlink:unauthorized', handler);
    return () => window.removeEventListener('careerlink:unauthorized', handler);
  }, [logout]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    authApi
      .me()
      .then((current) => {
        if (cancelled) return;
        const next = { id: current.id, name: current.name, email: current.email, role: current.role };
        setUser(next);
        const store = window.localStorage.getItem(TOKEN_KEY) ? window.localStorage : window.sessionStorage;
        store.setItem(USER_KEY, JSON.stringify(next));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(
    async (payload: LoginPayload, remember = true) => {
      const auth = await authApi.login(payload);
      persistSession(auth, { remember });
      return auth;
    },
    [persistSession]
  );

  const loginWithGoogle = useCallback(
    async (idToken: string, role?: Role, remember = true) => {
      const response = await authApi.googleAuth({ idToken, role });
      if (!response.roleRequired && response.token && response.role && response.userId) {
        persistSession(
          {
            token: response.token,
            userId: response.userId,
            email: response.email,
            role: response.role,
            expiresInMs: response.expiresInMs
          },
          { name: response.name, remember }
        );
      }
      return response;
    },
    [persistSession]
  );

  const register = useCallback(async (payload: RegisterPayload) => authApi.register(payload), []);
  const dashboardPath = user?.role === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/dashboard';

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      loginWithGoogle,
      register,
      logout,
      dashboardPath
    }),
    [dashboardPath, login, loginWithGoogle, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function roleDashboard(role: Role) {
  return role === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/dashboard';
}
