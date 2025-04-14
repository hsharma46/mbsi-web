
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("cricket_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("cricket_user");
      }
    }
  }, []);

  // Mock admin credentials - in a real app, this would be handled securely on a backend
  const adminCredentials = {
    username: "admin",
    password: "cricket123",
    user: {
      id: "1",
      username: "Admin",
      email: "admin@cricket.com",
      isAdmin: true,
    }
  };

  const login = (username: string, password: string): boolean => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setCurrentUser(adminCredentials.user);
      setIsAuthenticated(true);
      localStorage.setItem("cricket_user", JSON.stringify(adminCredentials.user));
      return true;
    }
    
    // For demo purposes, allow any other user to log in as a regular member
    if (username && password) {
      const regularUser: User = {
        id: "guest-" + Date.now(),
        username: username,
        email: `${username}@guest.com`,
        isAdmin: false,
      };
      setCurrentUser(regularUser);
      setIsAuthenticated(true);
      localStorage.setItem("cricket_user", JSON.stringify(regularUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("cricket_user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
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
