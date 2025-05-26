import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const useManageSavores = () => {
  const [savores, setSavores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchSavores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/savores`);
      setSavores(response.data);
    } catch (err) {
      console.error("Error fetching savores:", err);
      setError(err.message || "Error al cargar los sabores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavores();
  }, [fetchSavores]);

  const parseTamanosString = (tamanosString) => {
    if (!tamanosString || typeof tamanosString !== "string") return [];
    return tamanosString
      .split(",")
      .map((t) => parseInt(t.trim(), 10))
      .filter((t) => !isNaN(t) && t > 0);
  };

  const addSavor = async (savorData) => {
    setActionInProgress(true);
    setError(null);
    try {
      const newSavorPayload = {
        nombre: savorData.nombre,
        tamanos: parseTamanosString(savorData.tamanosStr),
        color: savorData.color,
      };
      const response = await axios.post(
        `${API_BASE_URL}/savores`,
        newSavorPayload
      );
      await fetchSavores();
      return response.data;
    } catch (err) {
      console.error("Error adding savor:", err);
      setError(err.message || "Error al agregar el sabor.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  const updateSavor = async (savorId, savorData) => {
    setActionInProgress(true);
    setError(null);
    try {
      const updatedSavorPayload = {
        id: savorId,
        nombre: savorData.nombre,
        tamanos: parseTamanosString(savorData.tamanosStr),
        color: savorData.color,
      };
      const response = await axios.put(
        `${API_BASE_URL}/savores/${savorId}`,
        updatedSavorPayload
      );
      await fetchSavores();
      return response.data;
    } catch (err) {
      console.error("Error updating savor:", err);
      setError(err.message || "Error al actualizar el sabor.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  const deleteSavor = async (savorId) => {
    setActionInProgress(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/savores/${savorId}`);
      await fetchSavores();
    } catch (err) {
      console.error("Error deleting savor:", err);
      setError(err.message || "Error al eliminar el sabor.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  return {
    savores,
    loading,
    error,
    fetchSavores,
    addSavor,
    updateSavor,
    deleteSavor,
    actionInProgress,
  };
};

export default useManageSavores;
