import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import { LOGIN, UNAUTHORIZED } from "../Routes/routes";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const isLoadingAuth = useAppStore((state) => state.isLoadingAuth);

  const location = useLocation();

  if (isLoadingAuth) {
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
