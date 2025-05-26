import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { LOGIN, HOME } from "../Routes/routes";

const API_BASE_URL = "http://localhost:3001";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios`);
      const users = response.data;
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const userData = {
          id: user.id,
          username: user.username,
          role: user.role,
          nombreCompleto: user.nombreCompleto,
          ...(user.role === "cliente" &&
            user.clientId && { clientId: user.clientId }),
        };
        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
