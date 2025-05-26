import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const cap = (val) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

const useGetProductos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const [savoresResponse, stockResponse, preciosResponse] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/savores`),
            axios.get(`${API_BASE_URL}/stock`),
            axios.get(`${API_BASE_URL}/precios`),
          ]);

        const savoresData = savoresResponse.data;
        const stockData = stockResponse.data;
        const preciosData = preciosResponse.data;

        const stockMap = stockData.reduce((acc, item) => {
          acc[item.productoId] = item;
          return acc;
        }, {});

        const mergedProducts = [];

        savoresData.forEach((savor) => {
          const stockInfo = stockMap[savor.id];

          if (stockInfo && stockInfo.cantidad) {
            savor.tamanos.forEach((tamano) => {
              const tamanoStr = tamano.toString();

              const precio = preciosData[tamanoStr];
              const stockCount = stockInfo.cantidad[tamanoStr];

              if (precio !== undefined && stockCount !== undefined) {
                mergedProducts.push({
                  id: savor.id,
                  nombre: `${cap(savor.nombre)} ${tamano}ml`,
                  tamano: tamano,
                  color: savor.color,
                  precio: precio,
                  stock: stockCount,
                  stockItemId: stockInfo.id,
                });
              }
            });
          }
        });

        setProducts(mergedProducts);
      } catch (err) {
        console.error("Error:", err);
        if (err.response) {
          setError(
            `API Error: ${err.response.status} ${
              err.response.statusText || ""
            } - ${err.response.data?.message || err.message}`
          );
        } else if (err.request) {
          setError("No response.");
        } else {
          setError(
            err.message || "Error fetching."
          );
        }
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

export default useGetProductos;
