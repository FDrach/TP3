import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useAppStore from "../store/useAppStore";

const API_BASE_URL = "http://localhost:3001";

const useGestionarVenta = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const cartItems = useAppStore((state) => state.cartItems);
  const totalAmount = useAppStore((state) => state.totalAmount);
  const zustandAddToCart = useAppStore((state) => state.addToCart);
  const zustandRemoveFromCart = useAppStore((state) => state.removeFromCart);
  const zustandUpdateCartItemQuantity = useAppStore(
    (state) => state.updateCartItemQuantity
  );
  const zustandClearCart = useAppStore((state) => state.clearCart);

  const [clientes, setClientes] = useState([]);
  const [currentClienteDetalles, setCurrentClienteDetalles] = useState(null);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [errorClientes, setErrorClientes] = useState(null);
  const [processingSale, setProcessingSale] = useState(false);
  const [saleError, setSaleError] = useState(null);
  const [saleSuccess, setSaleSuccess] = useState(false);

  const fetchClientData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingClientes(true);
    setErrorClientes(null);
    try {
      if (currentUser.role === "admin" || currentUser.role === "empleado") {
        const response = await axios.get(`${API_BASE_URL}/clientes`);
        setClientes(response.data);
        setCurrentClienteDetalles(null);
      } else if (currentUser.role === "cliente" && currentUser.clientId) {
        const response = await axios.get(
          `${API_BASE_URL}/clientes/${currentUser.clientId}`
        );
        setCurrentClienteDetalles(response.data);
        setClientes([]);
      }
    } catch (err) {
      console.error("Error fetching client data:", err);
      setErrorClientes("Error al cargar datos del cliente.");
    } finally {
      setLoadingClientes(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const addToCart = (product, quantity) => {
    const success = zustandAddToCart(product, quantity);
    if (!success && product.stock > 0 && quantity <= product.stock) {
      alert(
        `No se pudo agregar la cantidad deseada de ${product.nombre}. Verifique el stock o la cantidad ya en el carrito.`
      );
    } else if (!success && quantity > product.stock) {
      alert(
        `No puede agregar más de ${product.stock} unidades de ${product.nombre}.`
      );
    }
    if (success) {
      setSaleSuccess(false);
      setSaleError(null);
    }
    return success;
  };

  const finalizarVenta = async (saleDetails) => {
    if (cartItems.length === 0) {
      setSaleError("El carrito está vacío.");
      return false;
    }
    setProcessingSale(true);
    setSaleError(null);
    setSaleSuccess(false);

    const saleObj = {
      clienteId:
        saleDetails.selectedClienteId ||
        (currentUser.role === "cliente" ? currentUser.clientId : null),
      usuarioId: currentUser.id,
      empleadoId:
        currentUser.role === "admin" || currentUser.role === "empleado"
          ? currentUser.id
          : null,
      fechaPedido: new Date().toISOString(),
      estado: "pendiente",
      items: cartItems.map((item) => ({
        savorId: item.savorId,
        tamano: item.tamano,
        productoNombre: item.nombre,
        cantidad: item.quantity,
        precioUnitario: item.unitPrice,
        subtotal: item.subtotal,
      })),
      montoTotal: totalAmount,
      metodoPago: saleDetails.metodoPago,
      direccionEntrega: saleDetails.direccionEntrega,
      notasCliente: saleDetails.notasCliente,
    };

    if (!saleObj.clienteId) {
      const errorMsg =
        currentUser.role === "admin" || currentUser.role === "empleado"
          ? "Por favor, seleccione un cliente para la venta."
          : "Información de cliente no encontrada para el usuario actual.";
      setSaleError(errorMsg);
      setProcessingSale(false);
      return false;
    }

    try {
      for (const item of cartItems) {
        const stockItemResponse = await axios.get(
          `${API_BASE_URL}/stock/${item.stockItemId}`
        );
        const currentStockItem = stockItemResponse.data;
        const tamanoStr = item.tamano.toString();
        if (
          !currentStockItem.cantidad ||
          currentStockItem.cantidad[tamanoStr] === undefined ||
          currentStockItem.cantidad[tamanoStr] < item.quantity
        ) {
          throw new Error(
            `Stock insuficiente para ${item.nombre}. Disponible: ${
              currentStockItem.cantidad
                ? currentStockItem.cantidad[tamanoStr]
                : 0
            }, Pedido: ${item.quantity}`
          );
        }
        const updatedStockData = {
          ...currentStockItem,
          cantidad: {
            ...currentStockItem.cantidad,
            [tamanoStr]: currentStockItem.cantidad[tamanoStr] - item.quantity,
          },
        };
        await axios.put(
          `${API_BASE_URL}/stock/${item.stockItemId}`,
          updatedStockData
        );
      }

      await axios.post(`${API_BASE_URL}/ventas`, saleObj);
      setSaleSuccess(true);
      zustandClearCart();
      setProcessingSale(false);
      return true;
    } catch (error) {
      console.error("Error during sale finalization:", error);
      setSaleError(
        error.message ||
          "Error al procesar la venta. Verifique el stock e intente de nuevo."
      );
      setProcessingSale(false);
      return false;
    }
  };

  return {
    cartItems,
    totalAmount,
    clientes,
    currentClienteDetalles,
    loadingClientes,
    errorClientes,
    addToCart,
    removeFromCart: zustandRemoveFromCart,
    updateCartItemQuantity: zustandUpdateCartItemQuantity,
    finalizarVenta,
    processingSale,
    saleError,
    saleSuccess,
    clearCart: zustandClearCart,
    fetchClientData,
  };
};

export default useGestionarVenta;
