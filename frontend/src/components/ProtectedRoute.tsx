// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// interface Props {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<Props> = ({ children }) => {
//   const { token } = useAuth();

//   // Also check localStorage for token in case context is not set yet
//   const storedToken = localStorage.getItem("token");

//   if (!token && !storedToken) {
//     return <Navigate to="/signin" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: string; // e.g., "admin"
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { token, user } = useAuth();

  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  const currentUser = user || storedUser;

  if (!token && !storedToken) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole) {
    const hasRole = currentUser?.roles?.some(
      (role: { name: string }) => role.name === requiredRole
    );
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
