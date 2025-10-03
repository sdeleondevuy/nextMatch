import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, setInitPoints, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function InitPoints() {
  const [user, setUser] = useState(null);
  const [initPoints, setInitPointsValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data);
        // Si ya tiene puntos configurados, pre-cargar el valor
        if (response.data.points && response.data.points.initPoints) {
          setInitPointsValue(response.data.points.initPoints.toString());
        }
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error cargando perfil de usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!initPoints || initPoints.trim() === '') {
      setError("Debes ingresar un valor para los puntos iniciales");
      return;
    }

    const points = parseInt(initPoints);
    if (isNaN(points) || points <= 0 || points > 10000) {
      setError("Los puntos iniciales deben ser un número entre 1 y 10,000");
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');
      
      const response = await setInitPoints(points);
      if (response.success) {
        setMessage("Puntos iniciales configurados exitosamente ✅");
        // Navegar al perfil después de un breve delay
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (error) {
      console.error("Error configurando puntos iniciales:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError(error.message || "Error configurando puntos iniciales");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // Permitir saltar la configuración de puntos iniciales
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
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
            <h1 className="text-2xl font-bold text-black mb-2">Configura tus Puntos Iniciales</h1>
            <p className="text-sm text-gray-600">
              Establece tu capital base para comenzar a jugar
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Puntos Iniciales */}
              <div>
                <label htmlFor="initPoints" className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos Iniciales *
                </label>
                <input
                  type="number"
                  id="initPoints"
                  name="initPoints"
                  value={initPoints}
                  onChange={(e) => setInitPointsValue(e.target.value)}
                  min="1"
                  max="10000"
                  placeholder="Ej: 1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  disabled={saving}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa un número entre 1 y 10,000 puntos
                </p>
              </div>

              {/* Información */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-blue-800 font-semibold mb-2 text-sm">💡 Información</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Los puntos iniciales son tu capital base para jugar</li>
                  <li>• Puedes modificarlos más tarde desde tu perfil</li>
                  <li>• Se recomienda empezar con 1000 puntos</li>
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="submit"
                  disabled={saving || !initPoints.trim()}
                  className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    "Configurar Puntos"
                  )}
                </button>
              </div>
            </form>

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

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">✕</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={handleSkip}
                disabled={saving}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Saltar por ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitPoints;
