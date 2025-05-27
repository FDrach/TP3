import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTOS, VENDER, MANAGE } from "../Routes/routes";

const Home = () => (
  <div className="home-container">
    <h1 className="home-title">Bienvenido a la Sodería</h1>
    <p className="home-subtitle">
      Sistema de gestión de ventas y stock. Elija una opción para comenzar:
    </p>
    <div className="home-actions">
      <Link to={PRODUCTOS} className="home-action-btn">
        Ver Productos
      </Link>
      <Link to={VENDER} className="home-action-btn">
        Vender Productos
      </Link>
      <Link to={MANAGE} className="home-action-btn">
        Panel de Gestión
      </Link>
    </div>
  </div>
);

export default Home;