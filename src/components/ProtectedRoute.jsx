import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LOGIN, UNAUTHORIZED } from "../Routes/routes";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        Verificando autenticación...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={UNAUTHORIZED} replace />;
  }

  return children;
};

export default ProtectedRoute;
