import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  MANAGE_CLIENTES,
  MANAGE_SAVORES,
  MANAGE_STOCK,
  MANAGE_PRECIOS,
  MANAGE
} from "../../Routes/routes";

const Manage = () => {
  const location = useLocation();

  const isManageHome = location.pathname === MANAGE;

  return (
    <div className="manage-container">
      <h1 className="manage-title">Gestión del Sistema</h1>

      <nav className="manage-nav">
        <Link to={MANAGE_CLIENTES} className="manage-nav-link">
          Gestionar Clientes
        </Link>
        <Link to={MANAGE_SAVORES} className="manage-nav-link">
          Gestionar Sabores
        </Link>
        <Link to={MANAGE_STOCK} className="manage-nav-link">
          Gestionar Stock
        </Link>
        <Link to={MANAGE_PRECIOS} className="manage-nav-link">
          Gestionar Precios
        </Link>
      </nav>

      <div className="manage-content">
        {isManageHome && (
          <p className="manage-welcome-message">
            Seleccione una opción del menú para comenzar a gestionar.
          </p>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default Manage;
