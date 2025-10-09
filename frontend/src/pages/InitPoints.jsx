import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, setInitPoints, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function InitPoints() {
  const [user, setUser] = useState(null);
  const [userSports, setUserSports] = useState([]);
  const [sportPoints, setSportPoints] = useState({});
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
        
        // Filtrar solo deportes que NO tienen puntos configurados (initPoints = 0 o sin configurar)
        const sportsWithoutPoints = response.data.userSports.filter(userSport => {
          const hasPoints = userSport.userPoints && (
            (Array.isArray(userSport.userPoints) && userSport.userPoints.length > 0 && userSport.userPoints[0].initPoints > 0) ||
            (typeof userSport.userPoints === 'object' && userSport.userPoints.initPoints !== undefined && userSport.userPoints.initPoints > 0)
          );
          return !hasPoints;
        });
        
        setUserSports(sportsWithoutPoints);
        
        // Si no hay deportes sin configurar, redirigir
        if (sportsWithoutPoints.length === 0) {
          navigate('/selectSport');
          return;
        }
        
        // Inicializar puntos para cada deporte sin configurar
        const initialPoints = {};
        sportsWithoutPoints.forEach(sport => {
          // Valor por defecto para deportes sin configurar
          initialPoints[sport.sport.id] = '1000';
        });
        setSportPoints(initialPoints);
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

  const handleSportPointsChange = (sportId, value) => {
    setSportPoints(prev => ({
      ...prev,
      [sportId]: value
    }));
  };

  const validateSportPoints = () => {
    for (const sport of userSports) {
      const points = sportPoints[sport.sport.id];
      if (!points || points.trim() === '') {
        setError(`Debes ingresar puntos para ${sport.sport.name}`);
        return false;
      }
      
      const pointsNum = parseInt(points);
      if (isNaN(pointsNum) || pointsNum <= 0 || pointsNum > 10000) {
        setError(`Los puntos para ${sport.sport.name} deben ser un número entre 1 y 10,000`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSportPoints()) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');
      
      // Preparar datos para enviar
      const sportPointsData = userSports.map(sport => ({
        sportId: sport.sport.id,
        initPoints: parseInt(sportPoints[sport.sport.id])
      }));
      
      const response = await setInitPoints(sportPointsData);
      if (response.success) {
        setMessage("Puntos iniciales configurados exitosamente para todos los deportes ✅");
        // Navegar a la selección de deporte para jugar después de un breve delay
        setTimeout(() => {
          navigate('/selectSport');
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
    navigate('/selectSport');
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

  if (userSports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar />
        <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-black mb-2">No hay deportes seleccionados</h1>
              <p className="text-sm text-gray-600">
                Primero necesitas seleccionar al menos un deporte
              </p>
            </div>
            <div className="card">
              <button
                onClick={() => navigate('/selectSports')}
                className="btn-primary w-full"
              >
                Seleccionar Deportes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black mb-2">Configura tus Puntos por Deporte</h1>
            <p className="text-sm text-gray-600">
              Establece tu nivel de experiencia para cada deporte
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Sports Points Configuration */}
              <div className="space-y-4">
                {userSports.map((userSport, index) => (
                  <div key={userSport.sport.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    {/* Sport Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {userSport.sport.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Configura tu nivel de experiencia
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userSport.userPoints && userSport.userPoints.length > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userSport.userPoints && userSport.userPoints.length > 0 ? '✓ Configurado' : '⏳ Pendiente'}
                      </span>
                    </div>
                    
                    {/* Points Input */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label htmlFor={`points-${userSport.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Puntos Iniciales para {userSport.sport.name} *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id={`points-${userSport.id}`}
                          value={sportPoints[userSport.sport.id] || ''}
                          onChange={(e) => handleSportPointsChange(userSport.sport.id, e.target.value)}
                          min="1"
                          max="10000"
                          placeholder="Ej: 1000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                          disabled={saving}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm">pts</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Ingresa un número entre 1 y 10,000 puntos
                        </p>
                        <div className="text-xs text-gray-400">
                          {sportPoints[userSport.sport.id] ? `${sportPoints[userSport.sport.id]} puntos` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-blue-800 font-semibold mb-2 text-sm">💡 Guía de Puntos por Nivel</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white rounded p-2">
                    <span className="font-medium text-green-700">Principiante</span>
                    <p className="text-gray-600">400-600 pts</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="font-medium text-yellow-700">Intermedio</span>
                    <p className="text-gray-600">700-900 pts</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="font-medium text-red-700">Avanzado</span>
                    <p className="text-gray-600">900-1000 pts</p>
                  </div>
                </div>
                <ul className="text-blue-700 text-sm space-y-1 mt-3">
                  <li>• Cada deporte puede tener un puntaje inicial diferente</li>
                  <li>• Refleja tu nivel real de experiencia en cada deporte</li>
                  <li>• Puedes modificarlos más tarde desde tu perfil</li>
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="submit"
                  disabled={saving}
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