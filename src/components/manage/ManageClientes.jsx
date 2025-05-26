import React, { useState, useEffect } from "react";
import useManageClientes from "../../hooks/useManageClientes";

const ManageClientes = () => {
  const {
    clientes,
    loading,
    error,
    addCliente,
    updateCliente,
    deleteCliente,
    fetchClientes,
    actionInProgress,
  } = useManageClientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null); // For editing
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    direccion: "",
    telefono: "",
    email: "",
    userId: "", // Optional: can be linked to a user account
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (currentCliente) {
      setFormData({
        nombreCompleto: currentCliente.nombreCompleto || "",
        direccion: currentCliente.direccion || "",
        telefono: currentCliente.telefono || "",
        email: currentCliente.email || "",
        userId: currentCliente.userId || "",
      });
    } else {
      // Reset form for new client
      setFormData({
        nombreCompleto: "",
        direccion: "",
        telefono: "",
        email: "",
        userId: "",
      });
    }
  }, [currentCliente, isModalOpen]); // Reset form when modal opens or currentCliente changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.nombreCompleto || !formData.email) {
      setFormError("Nombre Completo y Email son obligatorios.");
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Por favor, ingrese un email válido.");
      return;
    }

    try {
      if (currentCliente) {
        await updateCliente(currentCliente.id, {
          ...formData,
          id: currentCliente.id,
          fechaRegistro: currentCliente.fechaRegistro,
        });
      } else {
        await addCliente(formData);
      }
      closeModal();
      fetchClientes(); // Ensure the list is up-to-date
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar el cliente.");
    }
  };

  const openModal = (cliente = null) => {
    setCurrentCliente(cliente); // If cliente is null, it's for adding a new one
    setIsModalOpen(true);
    setFormError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCliente(null);
    // Form is reset by useEffect based on currentCliente and isModalOpen
  };

  const handleDelete = async (clienteId) => {
    if (window.confirm("¿Está seguro de que desea eliminar este cliente?")) {
      try {
        await deleteCliente(clienteId);
        fetchClientes(); // Refresh list
      } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  };

  if (loading && clientes.length === 0) {
    return <p className="loading-message">Cargando clientes...</p>;
  }

  if (error) {
    return <p className="error-message">Error al cargar clientes: {error}</p>;
  }

  return (
    <div className="manage-clientes-container dark-bg">
      <h2 className="management-section-title">Gestionar Clientes</h2>
      <button
        onClick={() => openModal()}
        className="add-cliente-button"
        disabled={actionInProgress}
      >
        {actionInProgress ? "Procesando..." : "Agregar Nuevo Cliente"}
      </button>

      {clientes.length === 0 && !loading && <p>No hay clientes registrados.</p>}

      {clientes.length > 0 && (
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Fecha Registro</th>
              <th>User ID</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombreCompleto}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono || "-"}</td>
                <td>{cliente.direccion || "-"}</td>
                <td>{new Date(cliente.fechaRegistro).toLocaleDateString()}</td>
                <td>{cliente.userId || "-"}</td>
                <td>
                  <button
                    onClick={() => openModal(cliente)}
                    className="edit-button"
                    disabled={actionInProgress}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
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
            <h3>
              {currentCliente ? "Editar Cliente" : "Agregar Nuevo Cliente"}
            </h3>
            {formError && <p className="form-error-message">{formError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombreCompleto">Nombre Completo:</label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="userId">User ID (Opcional):</label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="ID de usuario si está registrado"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={actionInProgress}
                >
                  {actionInProgress
                    ? "Guardando..."
                    : currentCliente
                    ? "Actualizar Cliente"
                    : "Agregar Cliente"}
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

export default ManageClientes;
