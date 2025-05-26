import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const useManagePrecios = () => {
  const [precios, setPrecios] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchPrecios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/precios`);
      setPrecios(response.data || {});
    } catch (err) {
      console.error("Error fetching precios:", err);
      setError(err.message || "Error al cargar los precios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrecios();
  }, [fetchPrecios]);

  const savePrecios = async (newPreciosData) => {
    setActionInProgress(true);
    setError(null);
    try {
      await axios.put(`${API_BASE_URL}/precios`, newPreciosData);
      await fetchPrecios();
      return true;
    } catch (err) {
      console.error("Error saving precios:", err);
      setError(err.message || "Error al guardar los precios.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  return {
    precios,
    loading,
    error,
    fetchPrecios,
    savePrecios,
    actionInProgress,
  };
};

export default useManagePrecios;
