import React, { useState } from "react";
import useManageVentas from "../../hooks/useManageVentas";

const ManageVentas = () => {
  const { ventas, loading, error } = useManageVentas();
  const [selectedVentaItems, setSelectedVentaItems] = useState(null);

  const openItemsModal = (items) => {
    setSelectedVentaItems(items);
  };

  const closeItemsModal = () => {
    setSelectedVentaItems(null);
  };

  if (loading) {
    return <p className="loading-message">Cargando historial de ventas...</p>;
  }

  if (error) {
    return <p className="error-message">Error al cargar ventas: {error}</p>;
  }

  return (
    <div className="manage-clientes-container dark-bg">
      {" "}
      {/* Reusing container class */}
      <h2 className="management-section-title">Historial de Ventas</h2>
      {ventas.length === 0 && !loading && <p>No hay ventas registradas.</p>}
      {ventas.length > 0 && (
        <table className="clientes-table">
          {" "}
          {/* Reusing table class */}
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
              <th>Nº Items</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.fechaFormateada}</td>
                <td>{venta.clienteNombre}</td>
                <td>{venta.empleadoNombre}</td>
                <td>${venta.montoTotal.toFixed(2)}</td>
                <td>{venta.metodoPago}</td>
                <td style={{ textTransform: "capitalize" }}>{venta.estado}</td>
                <td>{venta.itemsCount}</td>
                <td>
                  <button
                    onClick={() => openItemsModal(venta.items)}
                    className="edit-button" /* Reusing edit-button style for view details */
                    style={{ fontSize: "0.85em", padding: "5px 8px" }}
                  >
                    Ver Items
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedVentaItems && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "700px" }}>
            {" "}
            {/* Wider modal for items */}
            <h3>Detalle de la Venta</h3>
            <table
              className="clientes-table"
              style={{ marginTop: "10px", fontSize: "0.9em" }}
            >
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedVentaItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.productoNombre ||
                        `Savor ID: ${item.savorId}, Tam: ${item.tamano}`}
                    </td>
                    <td>{item.cantidad}</td>
                    <td>${item.precioUnitario.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-actions">
              <button onClick={closeItemsModal} className="cancel-button">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVentas;
