"use client";

import { createContext, useContext } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue>({ user: null });

export function AuthProvider({ user, children }: { user: AuthUser | null; children: React.ReactNode }) {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
