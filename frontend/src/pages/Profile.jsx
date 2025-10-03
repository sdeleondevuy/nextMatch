import { useState, useEffect } from "react";
import { getCurrentUser, updateProfile, removeToken, getUserSports, handleAuthError } from "../services/api";
import { useNavigate } from "react-router-dom";
import SportSelector from "../components/SportSelector";
import AuthNavbar from "../components/AuthNavbar";

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
      if (handleAuthError(error, navigate)) {
        return; // Error de autenticación manejado
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
    navigate("/");
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
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Title in body */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black mb-2">Mi Perfil</h1>
            <p className="text-sm text-gray-600">
              Gestiona tu información personal y deportes
            </p>
          </div>
      
          {/* Form */}
          <div className="card">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Nombre y Apellido en la misma fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Tu apellido"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Username y Email en la misma fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="mi_usuario"
                      value={form.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      pattern="[a-zA-Z0-9_]+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                {/* Fecha de nacimiento y Departamento en la misma fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento *</label>
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
                    {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Departamento *</label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="Tu departamento"
                      value={form.department}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                    {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </div>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Información Personal */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                        <span className="text-gray-900 font-medium">{user.name}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido:</label>
                        <span className="text-gray-900 font-medium">{user.lastName}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                        <span className="text-gray-900 font-medium">@{user.username}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cédula:</label>
                        <span className="text-gray-900 font-medium">{user.legalId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                        <span className="text-gray-900 font-medium">{user.email}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento:</label>
                        <span className="text-gray-900 font-medium">{user.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deportes */}
                <div>
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
                          key={sport.id}
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

                {/* Información Adicional */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento:</label>
                        <span className="text-gray-900 font-medium">{new Date(user.birthDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Edad:</label>
                        <span className="text-gray-900 font-medium">{user.age} años</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Miembro desde:</label>
                      <span className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={handleEdit}
                    className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300"
                  >
                    Editar Perfil
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.includes("✅") || message.includes("🎉") 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {message.includes("✅") || message.includes("🎉") ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-red-400">✕</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
