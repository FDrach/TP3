import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HOME,
  PRODUCTOS,
  ERROR,
  VENDER,
  LOGIN,
  UNAUTHORIZED,
  MANAGE,
  MANAGE_CLIENTES,
  MANAGE_SAVORES,
  MANAGE_STOCK,
  MANAGE_PRECIOS,
} from "./Routes/routes";
import ProductDisplay from "./components/ProductDisplay";
import Vender from "./components/Vender";
import Error from "./components/Error";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

import Manage from "./components/manage/Manage";
import ManageClientes from "./components/manage/ManageClientes";
import ManageSavores from "./components/manage/ManageSavores";
import ManageStock from "./components/manage/ManageStock";
import ManagePrecios from "./components/manage/ManagePrecios";

import "./App.css";

const App = () => {
  const ROLES = {
    CLIENTE: "cliente",
    EMPLEADO: "empleado",
    ADMIN: "admin",
  };

  return (
    <BrowserRouter>
      <Navbar />
      <div id="root-content">
        <Routes>
          <Route path={LOGIN} element={<Login />} />
          <Route path={HOME} element={<ProductDisplay />} />
          <Route path={PRODUCTOS} element={<ProductDisplay />} />

          <Route
            path={VENDER}
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLEADO, ROLES.ADMIN]}>
                <Vender />
              </ProtectedRoute>
            }
          />

          <Route
            path={MANAGE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLEADO, ROLES.ADMIN]}>
                <Manage />
              </ProtectedRoute>
            }
          >
            <Route path={MANAGE_CLIENTES} element={<ManageClientes />} />
            <Route path={MANAGE_SAVORES} element={<ManageSavores />} />
            <Route path={MANAGE_STOCK} element={<ManageStock />} />
            <Route path={MANAGE_PRECIOS} element={<ManagePrecios />} />
          </Route>

          <Route path={UNAUTHORIZED} element={<Unauthorized />} />
          <Route path={ERROR} element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
