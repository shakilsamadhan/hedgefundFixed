import React, { createContext, useContext, useState, useEffect } from "react";

interface Action {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  actions: Action[];
}

export interface User {
  id: number;
  email: string;
  username: string;
  roles: Role[];
}


interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
}
// interface AuthContextType {
//   token: string | null;
//   setToken: (token: string | null) => void;
//   isLoggedIn: boolean;
// }

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
  logout: () => {},
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
  useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    const { token, user } = event.data;
    if (token && user) {
      setToken(token);
      setUser(user);
      window.location.href = "/assets"; // redirect after login
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
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
    <AuthContext.Provider value={{ token, user,setToken, isLoggedIn, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
