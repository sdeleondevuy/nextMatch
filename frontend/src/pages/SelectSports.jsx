import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSports, getUserSports, updateUserSports, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function SelectSports() {
  const [availableSports, setAvailableSports] = useState([]);
  const [userSports, setUserSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      setLoading(true);
      const [sportsResponse, userSportsResponse] = await Promise.all([
        getSports(),
        getUserSports()
      ]);

      if (sportsResponse.success) {
        setAvailableSports(sportsResponse.data.sports);
      }

      if (userSportsResponse.success) {
        setUserSports(userSportsResponse.data.userSports);
      }
    } catch (error) {
      console.error("Error cargando deportes:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error cargando deportes");
    } finally {
      setLoading(false);
    }
  };

  const handleSportToggle = (sport) => {
    const currentUserSports = Array.isArray(userSports) ? userSports : [];
    const isSelected = currentUserSports.some(userSport => userSport.id === sport.id);
    
    if (isSelected) {
      setUserSports(currentUserSports.filter(userSport => userSport.id !== sport.id));
    } else {
      setUserSports([...currentUserSports, sport]);
    }
  };

  const isSportSelected = (sport) => {
    const currentUserSports = Array.isArray(userSports) ? userSports : [];
    return currentUserSports.some(userSport => userSport.id === sport.id);
  };

  const handleSaveAndContinue = async () => {
    if (userSports.length === 0) {
      setError("Debes seleccionar al menos un deporte para continuar");
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      setError('');
      
      const sportIds = userSports.map(sport => sport.id);
      const response = await updateUserSports(sportIds);
      
      if (response.success) {
        setMessage("Deportes guardados exitosamente ✅");
        // Navegar a initpoints después de un breve delay
        setTimeout(() => {
          navigate('/initpoints');
        }, 1500);
      }
    } catch (error) {
      console.error("Error guardando deportes:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error guardando deportes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando deportes...</p>
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
            <h1 className="text-2xl font-bold text-black mb-2">Selecciona tus Deportes</h1>
            <p className="text-sm text-gray-600">
              Elige al menos un deporte de tu interés
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <div className="space-y-6">
              {/* Sports Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Deportes Disponibles *
                </label>
                
                <div className="space-y-3">
                  {availableSports.map((sport) => (
                    <div
                      key={sport.id}
                      onClick={() => handleSportToggle(sport)}
                      className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        isSportSelected(sport)
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-25'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{sport.name}</span>
                        {isSportSelected(sport) && (
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Sports Summary */}
              {userSports.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-semibold mb-2 text-sm">
                    Deportes seleccionados ({userSports.length}):
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userSports.map((sport) => (
                      <span
                        key={sport.id}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                      >
                        {sport.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div>
                <button
                  onClick={handleSaveAndContinue}
                  disabled={saving || userSports.length === 0}
                  className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    "Continuar"
                  )}
                </button>
              </div>
            </div>

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
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectSports;
