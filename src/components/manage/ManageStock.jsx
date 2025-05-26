import React, { useState, useEffect } from "react";
import useManageStock from "../../hooks/useManageStock";

const ManageStock = () => {
  const {
    stockDisplayItems,
    loading,
    error,
    updateStockQuantities,
    initializeStockForSavor,
    deleteStockEntry,
    fetchStockData,
    actionInProgress,
  } = useManageStock();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStockItem, setCurrentStockItem] = useState(null);
  const [formDataQuantities, setFormDataQuantities] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (currentStockItem) {
      const initialQuantities = {};

      currentStockItem.definedTamanos.forEach((tamano) => {
        initialQuantities[tamano.toString()] =
          currentStockItem.quantities[tamano.toString()] || 0;
      });
      setFormDataQuantities(initialQuantities);
    } else {
      setFormDataQuantities({});
    }
  }, [currentStockItem, isModalOpen]);

  const handleQuantityChange = (tamano, value) => {
    const numValue = parseInt(value, 10);
    setFormDataQuantities((prev) => ({
      ...prev,
      [tamano.toString()]: isNaN(numValue) || numValue < 0 ? 0 : numValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!currentStockItem) return;

    const finalQuantities = {};
    let isValid = true;
    for (const tamano of currentStockItem.definedTamanos) {
      const key = tamano.toString();
      const val = Number(formDataQuantities[key]);
      if (isNaN(val) || val < 0) {
        isValid = false;
        setFormError(
          `Cantidad para tamaño ${tamano}ml debe ser un número no negativo.`
        );
        break;
      }
      finalQuantities[key] = val;
    }

    if (!isValid) return;

    try {
      if (currentStockItem.hasStockEntry && currentStockItem.stockEntryId) {
        await updateStockQuantities(
          currentStockItem.stockEntryId,
          currentStockItem.savorId,
          finalQuantities
        );
      } else {
        await initializeStockForSavor(
          currentStockItem.savorId,
          finalQuantities
        );
      }
      closeModal();
      fetchStockData();
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar el stock.");
    }
  };

  const openModal = (item) => {
    setCurrentStockItem(item);
    setIsModalOpen(true);
    setFormError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStockItem(null);
  };

  const handleDelete = async (stockEntryId, savorName) => {
    if (!stockEntryId) {
      alert("Este sabor no tiene una entrada de stock para eliminar.");
      return;
    }
    if (
      window.confirm(
        `¿Está seguro de que desea eliminar la entrada de stock para ${savorName}? Esto pondrá sus cantidades a N/A.`
      )
    ) {
      try {
        await deleteStockEntry(stockEntryId);
      } catch (err) {
        alert(`Error al eliminar entrada de stock: ${err.message}`);
      }
    }
  };

  if (loading && stockDisplayItems.length === 0) {
    return <p className="loading-message">Cargando stock...</p>;
  }

  if (error) {
    return <p className="error-message">Error al cargar stock: {error}</p>;
  }

  return (
    <div className="manage-clientes-container dark-bg">
      <h2 className="management-section-title">Gestionar Stock de Sabores</h2>

      {stockDisplayItems.length === 0 && !loading && (
        <p>
          No hay sabores definidos para gestionar stock. Agregue sabores
          primero.
        </p>
      )}

      {stockDisplayItems.length > 0 && (
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Sabor</th>
              <th>Color</th>
              <th>Cantidades por Tamaño (ml)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stockDisplayItems.map((item) => (
              <tr key={item.savorId}>
                <td>{item.savorName}</td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: item.savorColor,
                      border: "1px solid #555",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  ></span>
                  {item.savorColor}
                </td>
                <td>
                  {item.definedTamanos.length > 0
                    ? item.definedTamanos.map((tamano) => (
                        <span
                          key={tamano}
                          style={{
                            marginRight: "10px",
                            display: "inline-block",
                          }}
                        >
                          {tamano}ml:{" "}
                          <strong>
                            {item.quantities[tamano.toString()] !== undefined
                              ? item.quantities[tamano.toString()]
                              : item.hasStockEntry
                              ? "0"
                              : "N/A"}
                          </strong>
                        </span>
                      ))
                    : "No hay tamaños definidos"}
                </td>
                <td>
                  <button
                    onClick={() => openModal(item)}
                    className="edit-button"
                    disabled={actionInProgress}
                  >
                    {item.hasStockEntry ? "Editar Stock" : "Inicializar Stock"}
                  </button>
                  {item.hasStockEntry && item.stockEntryId && (
                    <button
                      onClick={() =>
                        handleDelete(item.stockEntryId, item.savorName)
                      }
                      className="delete-button"
                      disabled={actionInProgress}
                      style={{ marginLeft: "5px" }}
                    >
                      Eliminar Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && currentStockItem && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>
              {currentStockItem.hasStockEntry
                ? "Editar Stock de "
                : "Inicializar Stock para "}
              <strong>{currentStockItem.savorName}</strong>
            </h3>
            {formError && <p className="form-error-message">{formError}</p>}
            <form onSubmit={handleSubmit}>
              {currentStockItem.definedTamanos.length > 0 ? (
                currentStockItem.definedTamanos.map((tamano) => (
                  <div className="form-group" key={tamano}>
                    <label
                      htmlFor={`stock-${tamano}`}
                    >{`Cantidad para ${tamano}ml:`}</label>
                    <input
                      type="number"
                      id={`stock-${tamano}`}
                      name={tamano.toString()}
                      value={formDataQuantities[tamano.toString()] || "0"}
                      onChange={(e) =>
                        handleQuantityChange(tamano, e.target.value)
                      }
                      min="0"
                      required
                    />
                  </div>
                ))
              ) : (
                <p>No hay tamaños definidos para este sabor.</p>
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    actionInProgress ||
                    currentStockItem.definedTamanos.length === 0
                  }
                >
                  {actionInProgress ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-button"
                  disabled={actionInProgress}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStock;
