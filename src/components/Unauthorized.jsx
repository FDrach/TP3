import React from "react";
import { Link } from "react-router-dom";
import { HOME } from "../Routes/routes";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">403 - Acceso Denegado</h1>
      <p className="unauthorized-message">
        No tienes permiso para acceder a esta página.
      </p>
      <Link to={HOME} className="unauthorized-link">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default Unauthorized;
