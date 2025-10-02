import { useState, useEffect } from 'react';
import { getSports, getUserSports, updateUserSports } from '../services/api';

function SportSelector({ isOpen, onClose, onUpdate }) {
  const [availableSports, setAvailableSports] = useState([]);
  const [userSports, setUserSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const [sportsResponse, userSportsResponse] = await Promise.all([
        getSports(),
        getUserSports()
      ]);

      if (sportsResponse.success) {
        setAvailableSports(sportsResponse.data.sports || []);
      }

      if (userSportsResponse.success) {
        setUserSports(userSportsResponse.data.sports || []);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage('Error cargando los deportes');
    } finally {
      setLoading(false);
    }
  };

  const handleSportToggle = (sport) => {
    const currentUserSports = Array.isArray(userSports) ? userSports : [];
    const isSelected = currentUserSports.some(userSport => userSport.uuid === sport.uuid);
    
    if (isSelected) {
      setUserSports(prev => (Array.isArray(prev) ? prev : []).filter(userSport => userSport.uuid !== sport.uuid));
    } else {
      setUserSports(prev => [...(Array.isArray(prev) ? prev : []), sport]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const currentUserSports = Array.isArray(userSports) ? userSports : [];
      const sportUuids = currentUserSports.map(sport => sport.uuid);
      console.log('=== Frontend - Enviando deportes ===');
      console.log('userSports:', currentUserSports);
      console.log('sportUuids:', sportUuids);
      
      const response = await updateUserSports(sportUuids);

      if (response.success) {
        setMessage('Deportes actualizados exitosamente ✅');
        onUpdate(response.data);
        
        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error guardando deportes:', error);
      setMessage('Error guardando los deportes');
    } finally {
      setSaving(false);
    }
  };

  const isSelected = (sport) => {
    const currentUserSports = Array.isArray(userSports) ? userSports : [];
    return currentUserSports.some(userSport => userSport.uuid === sport.uuid);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Seleccionar Deportes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">Cargando deportes...</span>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Selecciona los deportes que te interesan. Puedes elegir uno o varios.
              </p>

              {/* Sports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Array.isArray(availableSports) && availableSports.map((sport) => (
                  <div
                    key={sport.uuid}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected(sport)
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSportToggle(sport)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        isSelected(sport)
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected(sport) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{sport.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Count */}
              <div className="text-sm text-gray-600 mb-6">
                {userSports.length} deporte{userSports.length !== 1 ? 's' : ''} seleccionado{userSports.length !== 1 ? 's' : ''}
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message.includes('✅') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    'Guardar Deportes'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SportSelector;
