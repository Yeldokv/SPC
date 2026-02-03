import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  username: string;
  role: "admin";
};

type AuthContextType = {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simple mock auth for prototype
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string) => {
    setUser({ username, role: "admin" });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
