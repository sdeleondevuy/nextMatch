import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, setInitPoints, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function InitPoints() {
  const [user, setUser] = useState(null);
  const [initPoints, setInitPointsValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    if (isNaN(points) || points <= 0) {
      setError("Los puntos iniciales deben ser un número positivo");
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const response = await setInitPoints(points);
      if (response.success) {
        // Navegar al perfil después de configurar los puntos
        navigate('/profile');
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
      
      <div className="form-container">
        <h2>Configurar Puntos Iniciales</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            Configura tus puntos iniciales para comenzar a jugar. Estos puntos se utilizarán como base para tus partidas.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="initPoints" className="block text-sm font-medium text-gray-700 mb-2">
                Puntos Iniciales
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Ingresa un número entre 1 y 10,000 puntos
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold mb-2">💡 Información</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Los puntos iniciales son tu capital base para jugar</li>
                <li>• Puedes modificarlos más tarde desde tu perfil</li>
                <li>• Se recomienda empezar con 1000 puntos</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleSkip}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Saltar por ahora
              </button>
              
              <button
                type="submit"
                disabled={saving || !initPoints.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Guardando...' : 'Configurar Puntos'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InitPoints;
