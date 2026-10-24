import { createContext } from "react";
import type { TokenClaims } from "./auth";

export interface AuthContextValue {
  accessToken: string | null;
  claims: TokenClaims | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
