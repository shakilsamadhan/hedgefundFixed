import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}
// interface AuthContextType {
//   token: string | null;
//   setToken: (token: string | null) => void;
//   isLoggedIn: boolean;
// }

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isLoggedIn: false,
});


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setTokenState(storedToken);
  }, []);

  const setToken = (token: string | null) => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    setTokenState(token);
  };
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
    else localStorage.removeItem("user");
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // remove the token
    setToken(null);                   // update context state
  }
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, setToken, isLoggedIn, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
