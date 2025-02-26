import { createContext, useContext, useState } from "react";
import config from "../utils/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const {API_BASE_URL} = config


  const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout,setIsAuthenticated,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
