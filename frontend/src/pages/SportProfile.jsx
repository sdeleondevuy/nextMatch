import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, handleAuthError, calculateLevel } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function SportProfile() {
  const { sportId } = useParams();
  const [user, setUser] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [levelInfo, setLevelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSportProfile();
  }, [sportId]);

  const loadSportProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data);
        
        // Encontrar el deporte específico
        const sport = response.data.userSports.find(userSport => 
          userSport.sport.id === sportId && 
          userSport.userPoints
        );
        
        if (sport) {
          setSelectedSport(sport);
          
          // Calcular nivel desde actualPoints
          const points = Array.isArray(sport.userPoints) 
            ? sport.userPoints[0] 
            : sport.userPoints;
          
          if (points && points.actualPoints) {
            try {
              const levelResponse = await calculateLevel(points.actualPoints);
              if (levelResponse.success) {
                setLevelInfo(levelResponse.data);
              }
            } catch (levelError) {
              console.error("Error calculando nivel:", levelError);
            }
          }
        } else {
          setError('Deporte no encontrado o sin puntos configurados');
        }
      }
    } catch (error) {
      console.error("Error cargando perfil del deporte:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error cargando perfil del deporte");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSports = () => {
    navigate('/selectSport');
  };

  const handleEditProfile = () => {
    navigate('/initpoints');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil del deporte...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedSport) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar />
        <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-black mb-2">Error</h1>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <div className="card">
              <button
                onClick={handleBackToSports}
                className="btn-primary w-full"
              >
                Volver a Seleccionar Deporte
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const points = Array.isArray(selectedSport.userPoints) 
    ? selectedSport.userPoints[0] 
    : selectedSport.userPoints;
  const pointsDifference = points.actualPoints - points.initPoints;
  const isPositive = pointsDifference >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AuthNavbar />
      
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={handleBackToSports}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center mx-auto transition-colors"
            >
              ← Volver a deportes
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedSport.sport.name}
            </h1>
            <p className="text-gray-600">
              {user.name} {user.lastName}
            </p>
          </div>

          {/* Level Card - Destacado */}
          {levelInfo && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 shadow-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tu Nivel Actual</p>
                  <h2 className="text-5xl font-bold mb-2">Nivel {levelInfo.nivel}</h2>
                  <p className="text-blue-100 text-sm">
                    Rango: {levelInfo.rangoMin} - {levelInfo.rangoMax} puntos
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold">{levelInfo.nivel}</span>
                  </div>
                  <p className="text-sm text-blue-100">
                    {points.actualPoints} pts
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Estadísticas</h3>
              
              {/* Stats Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Puntos Actuales</span>
                  <span className={`text-xl font-bold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {points.actualPoints}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Puntos Iniciales</span>
                  <span className="text-xl font-bold text-gray-900">
                    {points.initPoints}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Diferencia</span>
                  <span className={`text-xl font-bold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{pointsDifference}
                  </span>
                </div>
                
                {levelInfo && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm text-blue-900 font-medium">Nivel Actual</span>
                    <span className="text-xl font-bold text-blue-600">
                      Nivel {levelInfo.nivel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ranking Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Ranking</h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    #1
                  </div>
                  <div className="text-sm text-gray-600">
                    Posición Local
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    (Próximamente)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">-</div>
                    <div className="text-xs text-gray-500">Victorias</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">-</div>
                    <div className="text-xs text-gray-500">Derrotas</div>
                  </div>
                </div>
                
                <p className="text-xs text-center text-gray-500 mt-2">
                  Los datos de ranking estarán disponibles próximamente
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/play/${selectedSport.sport.id}`)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                🎾 Jugar {selectedSport.sport.name}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-700 font-medium"
                >
                  👤 Perfil General
                </button>
                <button
                  onClick={handleBackToSports}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-700 font-medium"
                >
                  🔄 Cambiar Deporte
                </button>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Información del Usuario</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nombre</span>
                <span className="font-medium text-gray-900">{user.name} {user.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Deportes Activos</span>
                <span className="font-medium text-gray-900">
                  {user.userSports.filter(us => us.userPoints).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Departamento</span>
                <span className="font-medium text-gray-900">{user.department || 'No especificado'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SportProfile;
