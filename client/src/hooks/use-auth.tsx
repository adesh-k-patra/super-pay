import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check session validity on app load
    const validateSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include' // Include cookies in the request
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
        
        // Clean up any old localStorage data as migration
        localStorage.removeItem("kcredit_user");
        localStorage.removeItem("incred_user");
        
      } catch (error) {
        // Session validation failed - user is not authenticated
        // Error is silently handled - user will be redirected to login if needed
      }
      
      setIsLoading(false);
    };
    
    validateSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // No localStorage storage needed - JWT cookies handle authentication
    navigate("/home");
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      // Logout API call failed - continue with local logout
    }
    
    // Clear local user state
    setUser(null);
    navigate("/");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // No localStorage needed - user data comes from server session
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
