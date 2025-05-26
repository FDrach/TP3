import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const useVender = () => {
  const [vending, setVending] = useState(false);
  const [vendingError, setVendingError] = useState(null);

  const venderProducto = async (stockItemId, tamano) => {
    setVending(true);
    setVendingError(null);
    try {
      if (!stockItemId || tamano === undefined) {
        throw new Error("Stock Item ID and tamano are required for vending.");
      }
      const tamanoStr = tamano.toString();

      let currentStockItem;
      try {
        const stockItemResponse = await axios.get(
          `${API_BASE_URL}/stock/${stockItemId}`
        );
        currentStockItem = stockItemResponse.data;
      } catch (fetchErr) {
        console.error(`Error fetching stock item ${stockItemId}:`, fetchErr);

        const errorMessage =
          fetchErr.response?.status === 404
            ? `Stock item with ID ${stockItemId} not found on server.`
            : `Failed to fetch current stock details for item ${stockItemId}. Please try again.`;
        throw new Error(errorMessage);
      }

      if (
        !currentStockItem.cantidad ||
        currentStockItem.cantidad[tamanoStr] === undefined
      ) {
        throw new Error(
          `Stock information for size ${tamanoStr}ml not found on server for stock item ID ${stockItemId}.`
        );
      }
      if (currentStockItem.cantidad[tamanoStr] <= 0) {
        throw new Error(
          `Product (Stock ID: ${stockItemId}, Size: ${tamanoStr}ml) is out of stock on server.`
        );
      }

      const updatedStockData = {
        ...currentStockItem,
        cantidad: {
          ...currentStockItem.cantidad,
          [tamanoStr]: currentStockItem.cantidad[tamanoStr] - 1,
        },
      };

      await axios.put(`${API_BASE_URL}/stock/${stockItemId}`, updatedStockData);

      return true;
    } catch (error) {
      console.error("Vending Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        setVendingError(`API Error (${status}): ${message}`);
      } else {
        setVendingError(
          error.message || "An unexpected error occurred during vending."
        );
      }
      return false;
    } finally {
      setVending(false);
    }
  };

  return { venderProducto, vending, vendingError };
};

export default useVender;
