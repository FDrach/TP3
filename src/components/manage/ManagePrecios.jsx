import React, { useState, useEffect } from "react";
import useManagePrecios from "../../hooks/useManagePrecios";

const ManagePrecios = () => {
  const {
    precios,
    loading,
    error,
    savePrecios,
    fetchPrecios,
    actionInProgress,
  } = useManagePrecios();

  const [editablePrecios, setEditablePrecios] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [addTierError, setAddTierError] = useState("");

  useEffect(() => {
    if (precios) {
      setEditablePrecios({ ...precios });
    }
  }, [precios]);

  const handlePriceChange = (size, value) => {
    const priceValue = parseFloat(value);
    setEditablePrecios((prev) => ({
      ...prev,
      [size]: isNaN(priceValue) || priceValue < 0 ? 0 : priceValue,
    }));
    setSuccessMessage("");
  };

  const validateAllPrices = () => {
    for (const size in editablePrecios) {
      const price = Number(editablePrecios[size]);
      if (isNaN(price) || price < 0) {
        setFormError(
          `El precio para el tamaño ${size}ml debe ser un número no negativo.`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmitAllChanges = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");
    if (!validateAllPrices()) {
      return;
    }

    try {
      await savePrecios(editablePrecios);
      setSuccessMessage("¡Precios actualizados correctamente!");
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar los precios.");
    }
  };

  const handleAddNewTier = () => {
    setAddTierError("");
    setSuccessMessage("");
    const sizeValue = parseInt(newSize, 10);
    const priceValue = parseFloat(newPrice);

    if (isNaN(sizeValue) || sizeValue <= 0) {
      setAddTierError("El nuevo tamaño debe ser un número positivo.");
      return;
    }
    if (isNaN(priceValue) || priceValue < 0) {
      setAddTierError("El nuevo precio debe ser un número no negativo.");
      return;
    }
    const sizeKey = sizeValue.toString();
    if (editablePrecios.hasOwnProperty(sizeKey)) {
      setAddTierError(
        `El tamaño ${sizeKey}ml ya tiene un precio definido. Edítelo directamente.`
      );
      return;
    }

    setEditablePrecios((prev) => ({
      ...prev,
      [sizeKey]: priceValue,
    }));
    setNewSize("");
    setNewPrice("");
  };

  const handleDeleteTier = (sizeKey) => {
    if (
      window.confirm(
        `¿Está seguro de que desea eliminar el precio para el tamaño ${sizeKey}ml?`
      )
    ) {
      setSuccessMessage("");
      setEditablePrecios((prev) => {
        const updated = { ...prev };
        delete updated[sizeKey];
        return updated;
      });
    }
  };

  if (loading) {
    return <p className="loading-message">Cargando precios...</p>;
  }

  if (error && !Object.keys(editablePrecios).length) {
    return <p className="error-message">Error al cargar precios: {error}</p>;
  }

  return (
    <div className="manage-clientes-container dark-bg">
      {" "}
      
      <h2 className="management-section-title">Gestionar Precios Globales</h2>
      {formError && (
        <p className="form-error-message" style={{ textAlign: "center" }}>
          {formError}
        </p>
      )}
      {successMessage && (
        <p
          className="success-message"
          style={{ color: "green", textAlign: "center", marginBottom: "15px" }}
        >
          {successMessage}
        </p>
      )}
      {error && Object.keys(editablePrecios).length > 0 && (
        <p className="error-message" style={{ textAlign: "center" }}>
          Advertencia: Hubo un error al cargar datos ({error}), mostrando última
          data válida.
        </p>
      )}
      <form onSubmit={handleSubmitAllChanges}>
        {Object.keys(editablePrecios).length > 0 ? (
          Object.keys(editablePrecios)
            .sort((a, b) => Number(a) - Number(b))
            .map((size) => (
              <div
                className="form-group"
                key={size}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <label
                  htmlFor={`price-${size}`}
                  style={{ minWidth: "100px" }}
                >{`Tamaño ${size}ml:`}</label>
                <input
                  type="number"
                  id={`price-${size}`}
                  value={editablePrecios[size]}
                  onChange={(e) => handlePriceChange(size, e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteTier(size)}
                  className="delete-button"
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "8px 12px",
                    fontSize: "0.9em",
                  }}
                  disabled={actionInProgress}
                >
                  Eliminar
                </button>
              </div>
            ))
        ) : (
          <p>
            No hay precios definidos. Puede agregar nuevos niveles de precio a
            continuación.
          </p>
        )}
        <button
          type="submit"
          className="submit-button"
          disabled={
            actionInProgress || Object.keys(editablePrecios).length === 0
          }
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            fontSize: "1.1em",
          }}
        >
          {actionInProgress ? "Guardando..." : "Guardar Todos los Cambios"}
        </button>
      </form>
      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #444",
          paddingTop: "20px",
        }}
      >
        <h3
          className="management-section-title"
          style={{ borderBottom: "none", marginBottom: "15px" }}
        >
          Agregar Nuevo Nivel de Precio
        </h3>
        {addTierError && (
          <p className="form-error-message" style={{ textAlign: "center" }}>
            {addTierError}
          </p>
        )}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="newSize">Nuevo Tamaño (ml):</label>
            <input
              type="number"
              id="newSize"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Ej: 250"
              min="1"
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="newPrice">Precio ($):</label>
            <input
              type="number"
              id="newPrice"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Ej: 120.50"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddNewTier}
          className="add-cliente-button" /* Reusing a suitable button style */
          disabled={actionInProgress || !newSize || !newPrice}
          style={{ width: "100%" }}
        >
          Agregar Nivel (No guarda permanentemente)
        </button>
        <p
          style={{
            fontSize: "0.9em",
            color: "#aaa",
            textAlign: "center",
            marginTop: "5px",
          }}
        >
          (Debe hacer clic en "Guardar Todos los Cambios" para aplicar
          permanentemente)
        </p>
      </div>
    </div>
  );
};

export default ManagePrecios;
