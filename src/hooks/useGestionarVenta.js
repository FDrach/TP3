import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = "http://localhost:3001";

const useGestionarVenta = () => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
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

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalAmount(newTotal);
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    if (quantity <= 0) return;
    if (quantity > product.stock) {
      alert(
        `No puede agregar más de ${product.stock} unidades de ${product.nombre}.`
      );
      return;
    }

    const cartItemId = `${product.id}-${product.tamano}`;
    const existingItemIndex = cartItems.findIndex(
      (item) => item.cartId === cartItemId
    );

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      const newQuantity =
        updatedCartItems[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        alert(
          `No puede agregar más de ${product.stock} unidades de ${product.nombre} en total.`
        );
        return;
      }
      updatedCartItems[existingItemIndex].quantity = newQuantity;
      updatedCartItems[existingItemIndex].subtotal =
        newQuantity * product.precio;
      setCartItems(updatedCartItems);
    } else {
      setCartItems((prevItems) => [
        ...prevItems,
        {
          cartId: cartItemId,
          savorId: product.id,
          tamano: product.tamano,
          stockItemId: product.stockItemId,
          nombre: product.nombre,
          color: product.color,
          quantity: quantity,
          unitPrice: product.precio,
          subtotal: quantity * product.precio,
          availableStock: product.stock,
        },
      ]);
    }
    setSaleSuccess(false);
    setSaleError(null);
  };

  const removeFromCart = (cartIdToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartId !== cartIdToRemove)
    );
  };

  const updateCartItemQuantity = (cartIdToUpdate, newQuantity) => {
    const itemIndex = cartItems.findIndex(
      (item) => item.cartId === cartIdToUpdate
    );
    if (itemIndex === -1) return;

    const item = cartItems[itemIndex];
    if (newQuantity <= 0) {
      removeFromCart(cartIdToUpdate);
      return;
    }
    if (newQuantity > item.availableStock) {
      alert(
        `No puede agregar más de ${item.availableStock} unidades de ${item.nombre}.`
      );
      return;
    }

    const updatedCartItems = [...cartItems];
    updatedCartItems[itemIndex].quantity = newQuantity;
    updatedCartItems[itemIndex].subtotal = newQuantity * item.unitPrice;
    setCartItems(updatedCartItems);
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
      setCartItems([]);
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

  const clearCart = () => {
    setCartItems([]);
    setTotalAmount(0);
  };

  return {
    cartItems,
    totalAmount,
    clientes,
    currentClienteDetalles,
    loadingClientes,
    errorClientes,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    finalizarVenta,
    processingSale,
    saleError,
    saleSuccess,
    clearCart,
    fetchClientData,
  };
};

export default useGestionarVenta;
