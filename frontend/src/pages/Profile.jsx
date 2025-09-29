import { useState, useEffect } from "react";
import { getCurrentUser, updateProfile, removeToken } from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data);
        setForm({
          name: response.data.name,
          email: response.data.email
        });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      if (error.message.includes("Token") || error.message.includes("401")) {
        // Token inválido, redirigir al login
        removeToken();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar error del campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
    setErrors({});
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      name: user.name,
      email: user.email
    });
    setMessage("");
    setErrors({});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const response = await updateProfile(form);
      
      if (response.success) {
        setUser(response.data);
        setEditing(false);
        setMessage("Perfil actualizado exitosamente ✅");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      
      if (error.message.includes("validation")) {
        setMessage("Por favor, corrige los errores en el formulario");
      } else if (error.message.includes("email ya está en uso")) {
        setMessage("El email ya está en uso por otro usuario");
      } else {
        setMessage(error.message || "Error actualizando perfil");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  if (loading && !user) {
    return (
      <div className="form-container">
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="form-container">
        <div className="error">Error cargando el perfil</div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Mi Perfil</h2>
      
      {editing ? (
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="profile-field">
            <label>Nombre:</label>
            <span>{user.name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <label>Miembro desde:</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="profile-actions">
            <button className="btn" onClick={handleEdit}>
              Editar Perfil
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Profile;
