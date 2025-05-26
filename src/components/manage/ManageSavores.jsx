import React, { useState, useEffect } from "react";
import useManageSavores from "../../hooks/useManageSavores";

const ManageSavores = () => {
  const {
    savores,
    loading,
    error,
    addSavor,
    updateSavor,
    deleteSavor,
    fetchSavores,
    actionInProgress,
  } = useManageSavores();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSavor, setCurrentSavor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    tamanosStr: "",
    color: "#000000",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (currentSavor) {
      setFormData({
        nombre: currentSavor.nombre || "",
        tamanosStr: currentSavor.tamanos ? currentSavor.tamanos.join(", ") : "",
        color: currentSavor.color || "#000000",
      });
    } else {
      setFormData({
        nombre: "",
        tamanosStr: "",
        color: "#000000",
      });
    }
  }, [currentSavor, isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setFormError("El nombre del sabor es obligatorio.");
      return false;
    }
    if (!formData.color.match(/^#[0-9a-fA-F]{6}$/)) {
      setFormError(
        "El color debe ser un código hexadecimal válido (ej: #RRGGBB)."
      );
      return false;
    }
    const tamanosArray = formData.tamanosStr
      .split(",")
      .map((t) => parseInt(t.trim(), 10))
      .filter((t) => !isNaN(t) && t > 0);
    if (tamanosArray.length === 0 && formData.tamanosStr.trim() !== "") {
      setFormError(
        "Los tamaños deben ser números válidos separados por comas (ej: 320, 500). Si se ingresa, al menos uno debe ser válido."
      );
      return false;
    }
    if (tamanosArray.length === 0 && formData.tamanosStr.trim() === "") {
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validateForm()) {
      return;
    }

    try {
      if (currentSavor) {
        await updateSavor(currentSavor.id, formData);
      } else {
        await addSavor(formData);
      }
      closeModal();
      fetchSavores();
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar el sabor.");
    }
  };

  const openModal = (savor = null) => {
    setCurrentSavor(savor);
    setIsModalOpen(true);
    setFormError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSavor(null);
  };

  const handleDelete = async (savorId) => {
    if (
      window.confirm(
        "¿Está seguro de que desea eliminar este sabor? Esto podría afectar el stock y productos existentes."
      )
    ) {
      try {
        await deleteSavor(savorId);
        fetchSavores();
      } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  };

  if (loading && savores.length === 0) {
    return <p className="loading-message">Cargando sabores...</p>;
  }

  if (error) {
    return <p className="error-message">Error al cargar sabores: {error}</p>;
  }

  return (
    <div className="manage-clientes-container dark-bg">
      {" "}
      
      <h2 className="management-section-title">Gestionar Sabores</h2>
      <button
        onClick={() => openModal()}
        className="add-cliente-button"
        disabled={actionInProgress}
      >
        {" "}
        
        {actionInProgress ? "Procesando..." : "Agregar Nuevo Sabor"}
      </button>
      {savores.length === 0 && !loading && <p>No hay sabores registrados.</p>}
      {savores.length > 0 && (
        <table className="clientes-table">
          {" "}
          
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Color</th>
              <th>Tamaños (ml)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {savores.map((savor) => (
              <tr key={savor.id}>
                <td>{savor.nombre}</td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: savor.color,
                      border: "1px solid #ccc",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  ></span>
                  {savor.color}
                </td>
                <td>
                  {savor.tamanos && savor.tamanos.length > 0
                    ? savor.tamanos.join(", ")
                    : "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => openModal(savor)}
                    className="edit-button"
                    disabled={actionInProgress}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(savor.id)}
                    className="delete-button"
                    disabled={actionInProgress}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{currentSavor ? "Editar Sabor" : "Agregar Nuevo Sabor"}</h3>
            {formError && <p className="form-error-message">{formError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Sabor:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tamanosStr">
                  Tamaños (separados por coma, ej: 320, 500):
                </label>
                <input
                  type="text"
                  id="tamanosStr"
                  name="tamanosStr"
                  value={formData.tamanosStr}
                  onChange={handleInputChange}
                  placeholder="320, 500, 1000, 2000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="color">Color (Hex):</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="color"
                    id="colorPicker"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    style={{ marginRight: "10px", height: "38px" }}
                  />
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                    pattern="^#[0-9a-fA-F]{6}$"
                    title="Debe ser un código hexadecimal de 6 dígitos, ej: #RRGGBB"
                    style={{ flexGrow: 1 }}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={actionInProgress}
                >
                  {actionInProgress
                    ? "Guardando..."
                    : currentSavor
                    ? "Actualizar Sabor"
                    : "Agregar Sabor"}
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

export default ManageSavores;
