/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  blocked: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const refreshUser = React.useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      setUser(response.data.user);
      toast.success(response.data.message || "Logged in successfully!");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.error || "Login failed");
      } else {
        toast.error("An unexpected error occurred during login.");
      }
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        phone,
      });
      toast.success(response.data.message || "Registered successfully!");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.error || "Registration failed");
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch {
      toast.error("Logout failed.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
