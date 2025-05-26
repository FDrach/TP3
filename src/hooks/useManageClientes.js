import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const useManageClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/clientes`);
      setClientes(response.data);
    } catch (err) {
      console.error("Error fetching clientes:", err);
      setError(err.message || "Error al cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const addCliente = async (clienteData) => {
    setActionInProgress(true);
    setError(null);
    try {
      // Construct the new client object without an 'id' field.
      // json-server will auto-assign one.
      const newClientePayload = {
        ...clienteData,
        fechaRegistro: new Date().toISOString(),
        userId: clienteData.userId || null, // Ensure userId is null if not provided or empty
      };
      // Ensure id is not part of the payload for new entries
      delete newClientePayload.id;

      const response = await axios.post(
        `${API_BASE_URL}/clientes`,
        newClientePayload
      );
      await fetchClientes(); // Refetch to ensure consistency and get the new ID
      return response.data;
    } catch (err) {
      console.error("Error adding cliente:", err);
      setError(err.message || "Error al agregar el cliente.");
      throw err; // Re-throw to be caught by the component
    } finally {
      setActionInProgress(false);
    }
  };

  const updateCliente = async (clienteId, clienteData) => {
    setActionInProgress(true);
    setError(null);
    try {
      const dataToUpdate = { ...clienteData, id: clienteId };

      const response = await axios.put(
        `${API_BASE_URL}/clientes/${clienteId}`,
        clienteData
      );
      await fetchClientes(); // Refetch
      return response.data;
    } catch (err) {
      console.error("Error updating cliente:", err);
      setError(err.message || "Error al actualizar el cliente.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  const deleteCliente = async (clienteId) => {
    setActionInProgress(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/clientes/${clienteId}`);
      await fetchClientes(); // Refetch
    } catch (err) {
      console.error("Error deleting cliente:", err);
      setError(err.message || "Error al eliminar el cliente.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    actionInProgress,
  };
};

export default useManageClientes;
