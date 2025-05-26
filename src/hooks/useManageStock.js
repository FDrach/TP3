import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const useManageStock = () => {
  const [stockDisplayItems, setStockDisplayItems] = useState([]);
  const [savores, setSavores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [savoresResponse, stockResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/savores`),
        axios.get(`${API_BASE_URL}/stock`),
      ]);

      const savoresData = savoresResponse.data;
      setSavores(savoresData);
      const stockData = stockResponse.data;

      const stockMap = stockData.reduce((map, item) => {
        map[item.productoId.toString()] = item;
        return map;
      }, {});

      const mergedItems = savoresData.map((savor) => {
        const stockEntry = stockMap[savor.id.toString()];
        return {
          savorId: savor.id,
          savorName: savor.nombre,
          savorColor: savor.color,
          definedTamanos: savor.tamanos || [],
          stockEntryId: stockEntry ? stockEntry.id : null,
          quantities: stockEntry ? stockEntry.cantidad : {},
          hasStockEntry: !!stockEntry,
        };
      });

      setStockDisplayItems(mergedItems);
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError(err.message || "Error al cargar datos de stock.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const updateStockQuantities = async (
    stockEntryId,
    savorId,
    newQuantities
  ) => {
    if (!stockEntryId) {
      console.error(
        "updateStockQuantities called without stockEntryId. Attempting to initialize."
      );
      return initializeStockForSavor(savorId, newQuantities);
    }
    setActionInProgress(true);
    setError(null);
    try {
      const payload = {
        productoId: savorId,
        cantidad: newQuantities,
      };
      await axios.put(`${API_BASE_URL}/stock/${stockEntryId}`, payload);
      await fetchStockData();
    } catch (err) {
      console.error("Error updating stock quantities:", err);
      setError(err.message || "Error al actualizar cantidades de stock.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  const initializeStockForSavor = async (savorId, initialQuantities) => {
    setActionInProgress(true);
    setError(null);
    try {
      const payload = {
        productoId: savorId,
        cantidad: initialQuantities,
      };

      await axios.post(`${API_BASE_URL}/stock`, payload);
      await fetchStockData();
    } catch (err) {
      console.error("Error initializing stock:", err);
      setError(err.message || "Error al inicializar stock para el sabor.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  const deleteStockEntry = async (stockEntryId) => {
    if (!stockEntryId) {
      console.error("Cannot delete stock entry without an ID.");
      setError("No se proporcionó ID para eliminar la entrada de stock.");
      return false;
    }
    setActionInProgress(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/stock/${stockEntryId}`);
      await fetchStockData();
      return true;
    } catch (err) {
      console.error("Error deleting stock entry:", err);
      setError(err.message || "Error al eliminar la entrada de stock.");
      throw err;
    } finally {
      setActionInProgress(false);
    }
  };

  return {
    stockDisplayItems,
    savores,
    loading,
    error,
    fetchStockData,
    updateStockQuantities,
    initializeStockForSavor,
    deleteStockEntry,
    actionInProgress,
  };
};

export default useManageStock;
