import React, { useState } from "react";
import useManageVentas from "../../hooks/useManageVentas";

const ManageVentas = () => {
  const { ventas, loading, error, updateVentaStatus, actionInProgress } =
    useManageVentas();
  const [selectedVentaItems, setSelectedVentaItems] = useState(null);
  const [statusUpdateError, setStatusUpdateError] = useState("");

  const openItemsModal = (items) => {
    setSelectedVentaItems(items);
  };

  const closeItemsModal = () => {
    setSelectedVentaItems(null);
  };

  const handleCompleteSale = async (ventaId) => {
    setStatusUpdateError("");
    if (actionInProgress) return;

    if (
      window.confirm(
        '¿Está seguro de que desea marcar esta venta como "completado"?'
      )
    ) {
      try {
        await updateVentaStatus(ventaId, "completado");
      } catch (err) {
        setStatusUpdateError(err.message || "No se pudo actualizar el estado.");
      }
    }
  };

  if (loading && ventas.length === 0) {
    return <p className="loading-message">Cargando historial de ventas...</p>;
  }

  if (error && ventas.length === 0) {
    return <p className="error-message">Error al cargar ventas: {error}</p>;
  }

  return (
    <div className="manage-clientes-container dark-bg">
      <h2 className="management-section-title">Historial de Ventas</h2>

      {statusUpdateError && (
        <p
          className="error-message"
          style={{ textAlign: "center", marginBottom: "15px" }}
        >
          {statusUpdateError}
        </p>
      )}
      {/* Display general loading/error if still relevant despite having some data */}
      {loading && ventas.length > 0 && (
        <p className="loading-message">Actualizando lista...</p>
      )}
      {error && ventas.length > 0 && (
        <p className="error-message">
          Error al actualizar: {error}. Mostrando datos previos.
        </p>
      )}

      {ventas.length === 0 && !loading && <p>No hay ventas registradas.</p>}

      {ventas.length > 0 && (
        <table className="clientes-table">
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
                <td
                  style={{
                    textTransform: "capitalize",
                    fontWeight:
                      venta.estado === "pendiente" ? "bold" : "normal",
                    color:
                      venta.estado === "pendiente"
                        ? "#ffc107"
                        : venta.estado === "completado"
                        ? "lightgreen"
                        : "inherit",
                  }}
                >
                  {venta.estado}
                </td>
                <td>{venta.itemsCount}</td>
                <td
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <button
                    onClick={() => openItemsModal(venta.items)}
                    className="edit-button"
                    style={{ fontSize: "0.85em", padding: "5px 8px" }}
                    disabled={actionInProgress}
                  >
                    Ver Items
                  </button>
                  {venta.estado === "pendiente" && (
                    <button
                      onClick={() => handleCompleteSale(venta.id)}
                      className="submit-button"
                      style={{
                        fontSize: "0.85em",
                        padding: "5px 8px",
                        backgroundColor: "#28a745",
                      }}
                      disabled={actionInProgress}
                    >
                      Completar
                    </button>
                  )}
                  {venta.estado !== "pendiente" && (
                    <button
                      className="submit-button"
                      style={{ fontSize: "0.85em", padding: "5px 8px" }}
                      disabled={true}
                    >
                      Completar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedVentaItems && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "700px" }}>
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
              <button
                onClick={closeItemsModal}
                className="cancel-button"
                disabled={actionInProgress}
              >
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
