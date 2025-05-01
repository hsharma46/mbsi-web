
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for token on load
  useEffect(() => {
    const storedToken = localStorage.getItem("pdf-nexus-token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Mock API call for now
      console.log("Making API call to login with:", username, password);
      
      // API call pseudocode:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // if (!response.ok) throw new Error('Login failed');
      // const data = await response.json();
      
      // Mocking successful response with token
      const mockToken = "sample-jwt-token-" + Math.random().toString(36).substring(2);
      
      // Store token
      localStorage.setItem("pdf-nexus-token", mockToken);
      setToken(mockToken);
      setIsAuthenticated(true);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to PDF Nexus!",
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials, please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("pdf-nexus-token");
    setToken(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
