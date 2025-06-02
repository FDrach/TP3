import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import { HOME, PRODUCTOS, VENDER, LOGIN, MANAGE } from "../Routes/routes";

const Navbar = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const logout = useAppStore((state) => state.logout);
  const cartItemCount = useAppStore((state) => state.cartItems.length);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(LOGIN);
  };

  const ROLES = {
    CLIENTE: "cliente",
    EMPLEADO: "empleado",
    ADMIN: "admin",
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to={HOME} className="navbar-link">
          Home
        </Link>
        <Link to={PRODUCTOS} className="navbar-link">
          Productos
        </Link>

        {currentUser &&
          (currentUser.role === ROLES.ADMIN ||
            currentUser.role === ROLES.EMPLEADO) && (
            <>
              <Link to={MANAGE} className="navbar-link">
                Manage
              </Link>
            </>
          )}

        {currentUser && (
          <Link to={VENDER} className="navbar-link">
            Vender {cartItemCount > 0 && `(${cartItemCount})`}
          </Link>
        )}
      </div>

      <div className="navbar-user-section">
        {currentUser ? (
          <>
            <span className="navbar-user-greeting">
              Hola, {currentUser.nombreCompleto} ({currentUser.role})
            </span>
            <button onClick={handleLogout} className="navbar-button-logout">
              Logout
            </button>
          </>
        ) : (
          <Link to={LOGIN} className="navbar-button-login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
