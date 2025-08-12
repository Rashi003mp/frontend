import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


const RoleBasedRoute = ({ allowedRoles = [], redirectTo = "/login" }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // show spinner or nothing while loading state

  // Check role access
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
