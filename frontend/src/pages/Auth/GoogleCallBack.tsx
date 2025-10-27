// src/pages/auth/GoogleCallback.tsx
import { useEffect } from "react";
import { Role, useAuth, User } from "../../context/AuthContext";

export default function GoogleCallback() {
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || "";
    const id = parseInt(params.get("id") || "0");
    const email = params.get("email") || "";
    const username = params.get("username") || email.split("@")[0];
    const rolesParam = params.get("roles")?.split(",") || [];
    const roles: Role[] = rolesParam.map((name, index) => ({
      id: index,
      name,
      actions: [],
    }));

    if (token && email) {
      const user: User = { id ,email, username, roles };

      // Send token & user to the main window
      if (window.opener) {
        window.opener.postMessage({ token, user }, window.location.origin);
        window.close(); // close the popup
      } else {
        // fallback if not opened as popup
        setToken(token);
        setUser(user);
        window.location.href = "/assets";
      }
    } else {
      if (window.opener) window.close();
      else window.location.href = "/signin";
    }
  }, [setToken, setUser]);

  return <p>Logging in with Google...</p>;
}
