import { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.auth.login(email, password);
      if (!res || res.success === false) return false;

      const token = res.token || res.data?.token;
      const userObj = res.user || res.data?.user;

      if (token) localStorage.setItem("authToken", token);
      if (userObj) localStorage.setItem("user", JSON.stringify(userObj));

      setIsLoggedIn(!!token);
      setUser(userObj || null);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        const parsedUser = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, checkAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
