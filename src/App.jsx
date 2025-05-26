/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HOME, PRODUCTOS, ERROR, VENDER } from "./Routes/routes";
import ProductDisplay from "./components/ProductDisplay";
import Vender from "./components/Vender";
import Error from "./components/Error";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME} element={<ProductDisplay />} />
        <Route path={PRODUCTOS} element={<ProductDisplay />} />
        <Route path="*" element={<Error />} />
        <Route path={VENDER} element={<Vender />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
