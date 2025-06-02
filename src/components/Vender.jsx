import React, { useState, useEffect } from "react";
import useGetProductos from "../hooks/useGetProductos";
import useGestionarVenta from "../hooks/useGestionarVenta";
import useAppStore from "../store/useAppStore";
import { createSvg } from "../utils/createSvg";

const Vender = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProductsList,
  } = useGetProductos();

  const {
    cartItems,
    totalAmount,
    clientes,
    currentClienteDetalles,
    loadingClientes,

    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    finalizarVenta,
    processingSale,
    saleError,
    saleSuccess,
    clearCart,
  } = useGestionarVenta();

  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [notasCliente, setNotasCliente] = useState("");
  const [direccionEntrega, setDireccionEntrega] = useState("");

  useEffect(() => {
    if (currentUser.role === "cliente" && currentUser.clientId && currentUser) {
      setSelectedClienteId(currentUser.clientId.toString());
    } else if (
      clientes.length === 1 &&
      (currentUser.role === "admin" || currentUser.role === "empleado") &&
      currentUser
    ) {
      setSelectedClienteId(clientes[0].id.toString());
    }
  }, [currentUser, clientes]);

  useEffect(() => {
    if (currentUser.role === "cliente" && currentClienteDetalles && currentUser) {
      setDireccionEntrega(currentClienteDetalles.direccion || "");
    } else if (
      currentUser &&
      (currentUser.role === "admin" || currentUser.role === "empleado") &&
      selectedClienteId
    ) {
      const client = clientes.find(
        (c) => c.id.toString() === selectedClienteId
      );
      setDireccionEntrega(client ? client.direccion || "" : "");
    } else if (
      currentUser &&
      (currentUser.role === "admin" || currentUser.role === "empleado") &&
      !selectedClienteId
    ) {
      setDireccionEntrega("");
    }
  }, [selectedClienteId, clientes, currentUser, currentClienteDetalles]);

  const handleQuantityChange = (productId, tamano, value) => {
    const key = `${productId}-${tamano}`;
    setItemQuantities((prev) => ({ ...prev, [key]: parseInt(value, 10) || 1 }));
  };

  const handleAddToCartClick = (product) => {
    const key = `${product.id}-${product.tamano}`;
    const quantity = itemQuantities[key] || 1;
    const success = addToCart(product, quantity);
    if (success) {
      setItemQuantities((prev) => ({ ...prev, [key]: 1 }));
    }
  };

  const handleFinalizarVentaClick = async () => {
    let finalSelectedClienteId = selectedClienteId;
    if (currentUser && currentUser.role === "cliente" && currentUser.clientId) {
      finalSelectedClienteId = currentUser.clientId.toString();
    }

    const saleDetails = {
      selectedClienteId: finalSelectedClienteId,
      metodoPago,
      notasCliente,
      direccionEntrega,
    };
    const success = await finalizarVenta(saleDetails);
    if (success) {
      refetchProductsList();
      if (currentUser && currentUser.role !== "cliente") {
        setSelectedClienteId("");
      }
      setMetodoPago("efectivo");
      setNotasCliente("");
    }
  };

  const handleUpdateCartQuantity = (cartId, newQuantityStr) => {
    const newQuantity = parseInt(newQuantityStr, 10);
    if (isNaN(newQuantity)) return;
    updateCartItemQuantity(cartId, newQuantity);
  };

  const isLoading =
    productsLoading ||
    (currentUser &&
      loadingClientes &&
      ((currentUser.role === "cliente" && !currentClienteDetalles) ||
        ((currentUser.role === "admin" || currentUser.role === "empleado") &&
          clientes.length === 0)));

  if (isLoading) {
    return <p className="vender-loading-message">Cargando datos...</p>;
  }
  if (productsError)
    return (
      <p className="vender-error-message">
        Error al cargar productos: {productsError}
      </p>
    );

  return (
    <div className="vender-page-container dark-bg">
      <div className="vender-products-section">
        <h2 className="vender-section-title">Productos Disponibles</h2>
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <ul className="vender-product-list">
            {products.map((product) => {
              const key = `${product.id}-${product.tamano}`;
              return (
                <li key={key} className="vender-product-item">
                  <h3 className="vender-product-name">{product.nombre}</h3>
                  <img
                    className="vender-product-image"
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      createSvg(product.tamano, product.color)
                    )}`}
                    alt={product.nombre}
                  />
                  <p>Precio: ${product.precio.toFixed(2)}</p>
                  <p>
                    Stock:{" "}
                    <span
                      style={{
                        color: product.stock > 0 ? "lightgreen" : "orange",
                      }}
                    >
                      {product.stock}
                    </span>
                  </p>
                  <div className="vender-product-actions">
                    <input
                      type="number"
                      className="vender-quantity-input"
                      min="1"
                      max={product.stock}
                      value={itemQuantities[key] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.id,
                          product.tamano,
                          e.target.value
                        )
                      }
                      disabled={product.stock <= 0 || processingSale}
                    />
                    <button
                      className="vender-add-to-cart-button"
                      onClick={() => handleAddToCartClick(product)}
                      disabled={product.stock <= 0 || processingSale}
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="vender-cart-section">
        <h2 className="vender-section-title">Carrito de Compras</h2>
        {cartItems.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <>
            <table className="vender-cart-table clientes-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cartId}>
                    <td>{item.nombre}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateCartQuantity(item.cartId, e.target.value)
                        }
                        min="1"
                        max={item.availableStock}
                        className="vender-cart-quantity-input"
                        disabled={processingSale}
                      />
                    </td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                    <td>
                      <button
                        className="vender-remove-button delete-button"
                        onClick={() => removeFromCart(item.cartId)}
                        disabled={processingSale}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="vender-cart-total">
              <h3>Total: ${totalAmount.toFixed(2)}</h3>
            </div>
            <button
              onClick={clearCart}
              className="vender-clear-cart-button"
              disabled={processingSale}
            >
              Vaciar Carrito
            </button>
          </>
        )}

        {cartItems.length > 0 && currentUser && (
          <div className="vender-checkout-form">
            <h3 className="vender-section-subtitle">Detalles de la Venta</h3>
            {(currentUser.role === "admin" ||
              currentUser.role === "empleado") && (
              <div className="form-group">
                <label htmlFor="clienteSelect">Seleccionar Cliente:</label>
                {loadingClientes && clientes.length === 0 ? (
                  <p>Cargando clientes...</p>
                ) : (
                  <select
                    id="clienteSelect"
                    value={selectedClienteId}
                    onChange={(e) => setSelectedClienteId(e.target.value)}
                    disabled={processingSale}
                    required
                  >
                    <option value="">-- Seleccione un Cliente --</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombreCompleto} ({cliente.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="direccionEntrega">Dirección de Entrega:</label>
              <input
                type="text"
                id="direccionEntrega"
                value={direccionEntrega}
                onChange={(e) => setDireccionEntrega(e.target.value)}
                readOnly={
                  currentUser.role === "admin" ||
                  currentUser.role === "empleado"
                }
                disabled={processingSale}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="metodoPago">Método de Pago:</label>
              <select
                id="metodoPago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                disabled={processingSale}
                required
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="mercadopago">MercadoPago</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="notasCliente">Notas Adicionales:</label>
              <textarea
                id="notasCliente"
                value={notasCliente}
                onChange={(e) => setNotasCliente(e.target.value)}
                rows="3"
                disabled={processingSale}
              ></textarea>
            </div>

            {saleError && (
              <p
                className="vender-error-message"
                style={{ textAlign: "center" }}
              >
                {saleError}
              </p>
            )}
            {saleSuccess && (
              <p
                className="vender-success-message"
                style={{ color: "green", textAlign: "center" }}
              >
                ¡Venta realizada con éxito!
              </p>
            )}

            <button
              className="vender-finalize-button submit-button"
              onClick={handleFinalizarVentaClick}
              disabled={
                processingSale ||
                cartItems.length === 0 ||
                (!selectedClienteId &&
                  !(currentUser.role === "cliente" && currentUser.clientId))
              }
            >
              {processingSale ? "Procesando Venta..." : "Finalizar Venta"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vender;
