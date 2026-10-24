import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "./authContext";
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenValid,
  loginWithCredentials,
  parseAccessToken,
  storeAccessToken,
} from "./auth";

function loadSavedToken(): string | null {
  return getAccessToken();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(loadSavedToken);

  const logout = useCallback(() => {
    clearAccessToken();
    setAccessToken(null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const token = await loginWithCredentials(username, password);
    storeAccessToken(token);
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const timer = window.setInterval(() => {
      if (!isAccessTokenValid(accessToken)) logout();
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [accessToken, logout]);

  const value = useMemo(() => {
    const validToken =
      accessToken && isAccessTokenValid(accessToken) ? accessToken : null;
    return {
      accessToken: validToken,
      claims: validToken ? parseAccessToken(validToken) : null,
      isAuthenticated: validToken !== null,
      login,
      logout,
    };
  }, [accessToken, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
