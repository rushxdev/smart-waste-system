import { createContext, useContext, useState, type ReactNode } from "react";
import axiosInstance from "../services/axiosInstance";

interface User {
  id: string;
  name: string;
  email: string;
  role: "manager" | "collector" | "resident";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Safe localStorage helper functions
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Type guard to validate user data
const isValidUser = (data: unknown): data is User => {
  if (typeof data !== "object" || data === null) return false;
  const user = data as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    (user.role === "manager" || user.role === "collector" || user.role === "resident")
  );
};

// Safe function to get user from localStorage
const getStoredUser = (): User | null => {
  try {
    const userStr = safeGetItem("user");
    if (!userStr) return null;
    const userData = JSON.parse(userStr);
    return isValidUser(userData) ? userData : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    // Clear corrupted data
    safeRemoveItem("user");
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(safeGetItem("token"));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Validate user data before storing
      if (!isValidUser(user)) {
        throw new Error("Invalid user data received from server");
      }

      safeSetItem("token", token);
      safeSetItem("user", JSON.stringify(user));
      setUser(user);
      setToken(token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/register", { name, email, password, role });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    try {
      safeRemoveItem("token");
      safeRemoveItem("user");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);