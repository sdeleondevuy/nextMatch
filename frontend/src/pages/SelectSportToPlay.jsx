import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function SelectSportToPlay() {
  const [user, setUser] = useState(null);
  const [availableSports, setAvailableSports] = useState([]);
  const [sportsWithoutPoints, setSportsWithoutPoints] = useState([]);
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
        
        // Filtrar deportes con y sin puntos configurados
        const sportsWithPoints = response.data.userSports.filter(userSport => {
          const hasPoints = userSport.userPoints && (
            (Array.isArray(userSport.userPoints) && userSport.userPoints.length > 0 && userSport.userPoints[0].initPoints > 0) ||
            (typeof userSport.userPoints === 'object' && userSport.userPoints.initPoints !== undefined && userSport.userPoints.initPoints > 0)
          );
          return hasPoints;
        });
        
        const sportsWithoutPoints = response.data.userSports.filter(userSport => {
          const hasPoints = userSport.userPoints && (
            (Array.isArray(userSport.userPoints) && userSport.userPoints.length > 0 && userSport.userPoints[0].initPoints > 0) ||
            (typeof userSport.userPoints === 'object' && userSport.userPoints.initPoints !== undefined && userSport.userPoints.initPoints > 0)
          );
          return !hasPoints;
        });
        
        setAvailableSports(sportsWithPoints);
        setSportsWithoutPoints(sportsWithoutPoints);
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
    // Navegar al perfil específico del deporte
    navigate(`/profile/${sportId}`);
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
            <h1 className="text-3xl font-bold text-black mb-2">
              {availableSports.length > 1 ? '¿En qué deporte quieres jugar?' : 'Bienvenido a tu deporte'}
            </h1>
            <p className="text-gray-600">
              {availableSports.length > 1 
                ? 'Selecciona el deporte para ver tu perfil y puntaje actual'
                : 'Selecciona para ver tu perfil y puntaje actual'
              }
            </p>
          </div>

          {/* Sports Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
            {availableSports.map((userSport) => {
              // Generar nombre de archivo de imagen desde el nombre del deporte
              const imageName = userSport.sport.name
                .toLowerCase()
                .normalize('NFD') // Separar acentos
                .replace(/[\u0300-\u036f]/g, '') // Remover acentos
                .replace(/\s+/g, '-');
              const imagePath = `/images/sports/${imageName}.png`;
              
              return (
                <div
                  key={userSport.sport.id}
                  onClick={() => handleSportSelect(userSport.sport.id)}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-lime-300"
                >
                  {/* Sport Image - 100% del componente */}
                  <img 
                    src={imagePath}
                    alt={userSport.sport.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Si la imagen no existe, mostrar un placeholder
                      e.target.src = '/images/jsm-logo.png';
                      e.target.classList.add('object-contain', 'p-8');
                    }}
                  />
                  
                  {/* Overlay sutil on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="text-center space-y-3">
            {sportsWithoutPoints.length > 0 && (
              <button
                onClick={() => navigate('/initpoints')}
                className="bg-royal-500 hover:bg-royal-600 text-white w-full py-3 text-lg font-medium mb-4 rounded-lg transition-colors"
              >
                ⚙️ Configurar Puntos para {sportsWithoutPoints.length} Deporte{sportsWithoutPoints.length !== 1 ? 's' : ''} Restante{sportsWithoutPoints.length !== 1 ? 's' : ''}
              </button>
            )}
            <button
              onClick={handleBackToProfile}
              className="text-cyan-600 hover:text-cyan-800 transition-colors"
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
                {sportsWithoutPoints.length > 0 && (
                  <span className="text-orange-600">
                    {' • '}{sportsWithoutPoints.length} deporte{sportsWithoutPoints.length !== 1 ? 's' : ''} pendiente{sportsWithoutPoints.length !== 1 ? 's' : ''} de configuración
                  </span>
                )}
              </p>
              {sportsWithoutPoints.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Deportes pendientes: {sportsWithoutPoints.map(sport => sport.sport.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectSportToPlay;
