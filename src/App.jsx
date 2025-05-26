import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HOME,
  PRODUCTOS,
  ERROR,
  VENDER,
  LOGIN,
  UNAUTHORIZED,
} from "./Routes/routes";
import ProductDisplay from "./components/ProductDisplay";
import Vender from "./components/Vender";
import Error from "./components/Error";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

import "./App.css";

const App = () => {
  // Define roles for easier management
  const ROLES = {
    CLIENTE: "cliente",
    EMPLEADO: "empleado",
    ADMIN: "admin",
  };

  return (
    <BrowserRouter>
      <Navbar />
      <div id="root-content">
        {" "}
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
          <Route path={UNAUTHORIZED} element={<Unauthorized />} />
          <Route path={ERROR} element={<Error />} />{" "}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
