import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function SelectSportToPlay() {
  const [user, setUser] = useState(null);
  const [availableSports, setAvailableSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Helper function to get points from userPoints (handles both array and object)
  const getPoints = (userPoints) => {
    return Array.isArray(userPoints) ? userPoints[0] : userPoints;
  };

  useEffect(() => {
    loadUserSports();
  }, []);

  const loadUserSports = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data);
        
        // Filtrar solo deportes que tienen puntos configurados
        console.log("🔵 [FRONTEND] Datos del usuario recibidos:", response.data);
        console.log("🔵 [FRONTEND] UserSports:", response.data.userSports);
        
        const sportsWithPoints = response.data.userSports.filter(userSport => {
          const hasPoints = userSport.userPoints && (
            (Array.isArray(userSport.userPoints) && userSport.userPoints.length > 0) ||
            (typeof userSport.userPoints === 'object' && userSport.userPoints.initPoints !== undefined)
          );
          console.log(`🔵 [FRONTEND] ${userSport.sport.name} tiene puntos:`, hasPoints, userSport.userPoints);
          return hasPoints;
        });
        
        console.log("🔵 [FRONTEND] Deportes con puntos encontrados:", sportsWithPoints.length);
        
        setAvailableSports(sportsWithPoints);
        
        // Si solo tiene un deporte, redirigir directamente al perfil general (temporal)
        if (sportsWithPoints.length === 1) {
          console.log("🔵 [FRONTEND] Solo un deporte, navegando a perfil general");
          navigate('/profile');
        }
      }
    } catch (error) {
      console.error("Error cargando deportes del usuario:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error cargando tus deportes");
    } finally {
      setLoading(false);
    }
  };

  const handleSportSelect = (sportId) => {
    console.log("🔵 [FRONTEND] Deporte seleccionado:", sportId);
    console.log("🔵 [FRONTEND] Navegando a perfil general (temporal)");
    navigate('/profile');
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus deportes...</p>
        </div>
      </div>
    );
  }

  if (availableSports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar />
        <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-black mb-2">No tienes deportes configurados</h1>
              <p className="text-sm text-gray-600">
                Primero necesitas configurar puntos para tus deportes
              </p>
            </div>
            <div className="card">
              <button
                onClick={() => navigate('/initpoints')}
                className="btn-primary w-full mb-3"
              >
                Configurar Puntos
              </button>
              <button
                onClick={handleBackToProfile}
                className="btn-secondary w-full"
              >
                Ir al Perfil General
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">¿En qué deporte quieres jugar?</h1>
            <p className="text-gray-600">
              Selecciona el deporte para ver tu perfil y puntaje actual
            </p>
          </div>

          {/* Sports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableSports.map((userSport, index) => (
              <div
                key={userSport.sport.id}
                onClick={() => handleSportSelect(userSport.sport.id)}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
              >
                {/* Sport Icon/Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {getPoints(userSport.userPoints).actualPoints}
                    </div>
                    <div className="text-sm text-gray-500">puntos actuales</div>
                  </div>
                </div>

                {/* Sport Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {userSport.sport.name}
                </h3>

                {/* Points Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Puntos iniciales:</span>
                    <span className="font-medium">
                      {getPoints(userSport.userPoints).initPoints}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Puntos actuales:</span>
                    <span className={`font-medium ${
                      getPoints(userSport.userPoints).actualPoints >= getPoints(userSport.userPoints).initPoints
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {getPoints(userSport.userPoints).actualPoints}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          getPoints(userSport.userPoints).actualPoints >= getPoints(userSport.userPoints).initPoints
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(100, 
                            (getPoints(userSport.userPoints).actualPoints / getPoints(userSport.userPoints).initPoints) * 100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{getPoints(userSport.userPoints).initPoints}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-blue-600 text-sm font-medium">
                    → Ver perfil de {userSport.sport.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="text-center space-y-3">
            <button
              onClick={handleBackToProfile}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Volver al perfil general
            </button>
          </div>

          {/* User Info */}
          <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">{user.name} {user.lastName}</h3>
              <p className="text-sm text-gray-500">
                {availableSports.length} deporte{availableSports.length !== 1 ? 's' : ''} configurado{availableSports.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectSportToPlay;
