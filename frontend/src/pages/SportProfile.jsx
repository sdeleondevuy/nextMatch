import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function SportProfile() {
  const { sportId } = useParams();
  const [user, setUser] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
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
          userSport.userPoints && 
          userSport.userPoints.length > 0
        );
        
        if (sport) {
          setSelectedSport(sport);
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

  const points = selectedSport.userPoints[0];
  const pointsDifference = points.actualPoints - points.initPoints;
  const isPositive = pointsDifference >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={handleBackToSports}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center mx-auto"
            >
              ← Volver a deportes
            </button>
            <h1 className="text-3xl font-bold text-black mb-2">
              Perfil de {selectedSport.sport.name}
            </h1>
            <p className="text-gray-600">
              {user.name} {user.lastName} • {selectedSport.sport.name}
            </p>
          </div>

          {/* Sport Stats Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            {/* Sport Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-2xl">
                    {selectedSport.sport.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedSport.sport.name}
                  </h2>
                  <p className="text-gray-500">Tu puntaje actual</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {points.actualPoints}
                </div>
                <div className="text-sm text-gray-500">puntos</div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso</span>
                <span className="text-sm text-gray-500">
                  {points.actualPoints} / {points.initPoints}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (points.actualPoints / points.initPoints) * 100)}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>Inicial: {points.initPoints}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Puntos Iniciales</div>
                <div className="text-xl font-semibold text-gray-900">
                  {points.initPoints}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Diferencia</div>
                <div className={`text-xl font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? '+' : ''}{pointsDifference}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/play/${selectedSport.sport.id}`)}
              className="btn-primary w-full py-3 text-lg font-medium"
            >
              🎾 Jugar {selectedSport.sport.name}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEditProfile}
                className="btn-secondary py-2"
              >
                ✏️ Editar Puntos
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="btn-secondary py-2"
              >
                👤 Perfil General
              </button>
            </div>
          </div>

          {/* Sport Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-semibold mb-2 text-sm">
              📊 Estadísticas de {selectedSport.sport.name}
            </h3>
            <div className="text-blue-700 text-sm space-y-1">
              <div>• Puntos iniciales: {points.initPoints}</div>
              <div>• Puntos actuales: {points.actualPoints}</div>
              <div>• Diferencia: {isPositive ? '+' : ''}{pointsDifference} puntos</div>
              <div>• Estado: {isPositive ? '📈 Ganando' : '📉 Perdiendo'}</div>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">{user.name} {user.lastName}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">
                {user.userSports.filter(us => us.userPoints && us.userPoints.length > 0).length} deporte{user.userSports.filter(us => us.userPoints && us.userPoints.length > 0).length !== 1 ? 's' : ''} activo{user.userSports.filter(us => us.userPoints && us.userPoints.length > 0).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SportProfile;
