import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const useManageVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVentasData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ventasResponse, clientesResponse, usuariosResponse] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/ventas`),
          axios.get(`${API_BASE_URL}/clientes`),
          axios.get(`${API_BASE_URL}/usuarios`),
        ]);

      const ventasData = ventasResponse.data;
      const clientesData = clientesResponse.data;
      const usuariosData = usuariosResponse.data;

      const clientesMap = clientesData.reduce((map, cliente) => {
        map[cliente.id.toString()] = cliente.nombreCompleto;
        return map;
      }, {});

      const usuariosMap = usuariosData.reduce((map, usuario) => {
        map[usuario.id.toString()] = usuario.nombreCompleto;
        return map;
      }, {});

      const enrichedVentas = ventasData
        .map((venta) => ({
          ...venta,
          clienteNombre: venta.clienteId
            ? clientesMap[venta.clienteId.toString()] ||
              `ID Cliente: ${venta.clienteId}`
            : "N/A",
          empleadoNombre: venta.empleadoId
            ? usuariosMap[venta.empleadoId.toString()] ||
              `ID Empleado: ${venta.empleadoId}`
            : "N/A",
          fechaFormateada: new Date(venta.fechaPedido).toLocaleString(),
          itemsCount: venta.items ? venta.items.length : 0,
        }))
        .sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));

      setVentas(enrichedVentas);
    } catch (err) {
      console.error("Error fetching ventas data:", err);
      setError(err.message || "Error al cargar el historial de ventas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVentasData();
  }, [fetchVentasData]);

  return {
    ventas,
    loading,
    error,
    fetchVentasData,
  };
};

export default useManageVentas;
