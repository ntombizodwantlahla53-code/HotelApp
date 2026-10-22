import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const saveUser = localStorage.getItem("user");
  const user = saveUser ? JSON.parse(saveUser) : null;

  if (!user || user.role !== "Admin") {
    return <Navigate to="/Login" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;