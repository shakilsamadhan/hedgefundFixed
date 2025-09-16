import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function GoogleCallback() {
   const { setToken, setUser } = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const username = params.get("username") || email?.split("@")[0];

    if (token && email) {
      // Save token + user to localStorage
      const user = { email, username };
      setToken(token);
      setUser(user);

      // Redirect to protected route
      window.location.href = "/assets";
    } else {
      window.location.href = "/signin";
    }
  }, []);

  return <p>Logging in with Google...</p>;
}
