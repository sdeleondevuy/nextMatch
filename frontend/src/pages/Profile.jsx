import { useState, useEffect } from "react";
import { getCurrentUser, updateProfile, removeToken, getUserSports } from "../services/api";
import { useNavigate } from "react-router-dom";
import SportSelector from "../components/SportSelector";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    lastName: "", 
    username: "", 
    email: "", 
    birthDate: "", 
    department: "" 
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [userSports, setUserSports] = useState([]);
  const [showSportSelector, setShowSportSelector] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const [userResponse, sportsResponse] = await Promise.all([
        getCurrentUser(),
        getUserSports()
      ]);
      
      if (userResponse.success) {
        setUser(userResponse.data);
        setForm({
          name: userResponse.data.name,
          lastName: userResponse.data.lastName,
          username: userResponse.data.username,
          email: userResponse.data.email,
          birthDate: userResponse.data.birthDate ? new Date(userResponse.data.birthDate).toISOString().split('T')[0] : "",
          department: userResponse.data.department
        });
      }

      if (sportsResponse.success) {
        setUserSports(sportsResponse.data.sports || []);
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
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
      department: user.department
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

  const handleSportUpdate = async (updatedData) => {
    // Recargar los deportes del usuario desde la API para obtener los datos completos
    try {
      const sportsResponse = await getUserSports();
      if (sportsResponse.success) {
        const sports = sportsResponse.data.sports || [];
        setUserSports(sports);
      }
    } catch (error) {
      console.error('Error recargando deportes:', error);
    }
  };

  const handleOpenSportSelector = () => {
    setShowSportSelector(true);
  };

  const handleCloseSportSelector = () => {
    setShowSportSelector(false);
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
        <form onSubmit={handleSave} className="space-y-6">
          {/* Nombre y Apellido en la misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              {errors.name && <span className="text-sm text-red-600">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              {errors.lastName && <span className="text-sm text-red-600">{errors.lastName}</span>}
            </div>
          </div>

          {/* Username y Email en la misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                disabled={loading}
                pattern="[a-zA-Z0-9_]+"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              {errors.username && <span className="text-sm text-red-600">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              {errors.email && <span className="text-sm text-red-600">{errors.email}</span>}
            </div>
          </div>

          {/* Fecha de nacimiento y Departamento en la misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              {errors.birthDate && <span className="text-sm text-red-600">{errors.birthDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              {errors.department && <span className="text-sm text-red-600">{errors.department}</span>}
            </div>
          </div>

          <div className="form-actions flex space-x-4">
            <button type="submit" className="btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" className="btn-secondary px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCancel} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info space-y-6">
          {/* Información personal */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                <span className="text-gray-900">{user.name}</span>
              </div>
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Apellido:</label>
                <span className="text-gray-900">{user.lastName}</span>
              </div>
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Cédula:</label>
                <span className="text-gray-900">{user.cedula}</span>
              </div>
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Username:</label>
                <span className="text-gray-900">@{user.username}</span>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Departamento:</label>
                <span className="text-gray-900">{user.department}</span>
              </div>
            </div>
          </div>

          {/* Deportes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Deportes de Interés</h3>
              <button
                onClick={handleOpenSportSelector}
                className="btn-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                {userSports.length > 0 ? 'Editar Deportes' : 'Seleccionar Deportes'}
              </button>
            </div>
            
            {userSports.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userSports.map((sport) => (
                  <span
                    key={sport.uuid}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    🎾 {sport.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>No has seleccionado ningún deporte aún.</p>
                <p className="text-sm">Haz clic en "Seleccionar Deportes" para comenzar.</p>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento:</label>
                <span className="text-gray-900">{new Date(user.birthDate).toLocaleDateString()}</span>
              </div>
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Edad:</label>
                <span className="text-gray-900">{user.age} años</span>
              </div>
              <div className="profile-field">
                <label className="block text-sm font-medium text-gray-700">Miembro desde:</label>
                <span className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions flex space-x-4">
            <button className="btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-300" onClick={handleEdit}>
              Editar Perfil
            </button>
            <button className="btn-danger px-6 py-2 rounded-lg font-medium transition-all duration-300" onClick={handleLogout}>
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

      {/* Sport Selector Modal */}
      <SportSelector
        isOpen={showSportSelector}
        onClose={handleCloseSportSelector}
        onUpdate={handleSportUpdate}
      />
    </div>
  );
}

export default Profile;
