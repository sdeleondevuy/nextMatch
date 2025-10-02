import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSports, getUserSports, updateUserSports, handleAuthError } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import SportSelector from '../components/SportSelector';

function SelectSports() {
  const [availableSports, setAvailableSports] = useState([]);
  const [userSports, setUserSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSportSelector, setShowSportSelector] = useState(false);
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
        setUserSports(userSportsResponse.data.sports);
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

  const handleSportUpdate = async (selectedSportIds) => {
    try {
      const response = await updateUserSports(selectedSportIds);
      if (response.success) {
        setUserSports(response.data.sports);
        setShowSportSelector(false);
        
        // Si seleccionó al menos un deporte, navegar a initpoints
        if (selectedSportIds.length > 0) {
          navigate('/initpoints');
        }
      }
    } catch (error) {
      console.error("Error actualizando deportes:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error actualizando deportes");
    }
  };

  const handleContinue = () => {
    if (userSports.length > 0) {
      navigate('/initpoints');
    } else {
      setError("Debes seleccionar al menos un deporte para continuar");
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
      
      <div className="form-container">
        <h2>Selecciona tus Deportes</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            Para continuar, necesitas seleccionar al menos un deporte de tu interés.
          </p>

          {userSports.length > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-green-800 font-semibold mb-2">Deportes seleccionados:</h3>
              <div className="flex flex-wrap gap-2">
                {userSports.map((sport) => (
                  <span
                    key={sport.id}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {sport.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <strong>No has seleccionado ningún deporte aún.</strong>
              </p>
            </div>
          )}

          <button
            onClick={() => setShowSportSelector(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {userSports.length > 0 ? 'Modificar Deportes' : 'Seleccionar Deportes'}
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleContinue}
            disabled={userSports.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>

      {showSportSelector && (
        <SportSelector
          isOpen={showSportSelector}
          onUpdate={handleSportUpdate}
          onClose={() => setShowSportSelector(false)}
        />
      )}
    </div>
  );
}

export default SelectSports;
