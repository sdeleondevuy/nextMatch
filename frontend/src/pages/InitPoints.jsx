import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, setInitPoints, handleAuthError, getQuestionnaireStart, getQuestionnaireNext, calculateInitPointsFromAnswers } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';

function InitPoints() {
  const [user, setUser] = useState(null);
  const [userSports, setUserSports] = useState([]);
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Estados del cuestionario
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [allSportsResults, setAllSportsResults] = useState([]);
  const [showLevelPopup, setShowLevelPopup] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userSports.length > 0 && currentSportIndex < userSports.length) {
      loadQuestions();
    }
  }, [currentSportIndex, userSports]);

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
            (!Array.isArray(userSport.userPoints) && userSport.userPoints.initPoints > 0)
          );
          return !hasPoints;
        });
        
        if (sportsWithoutPoints.length === 0) {
          // Si no hay deportes sin configurar, redirigir a selectSport
          navigate('/selectSport');
          return;
        }
        
        setUserSports(sportsWithoutPoints);
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

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true);
      setError('');
      
      const response = await getQuestionnaireStart();
      if (response.success) {
        setCurrentQuestions(response.data.preguntas);
      }
    } catch (error) {
      console.error("Error cargando preguntas:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error cargando cuestionario");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswer = (questionId, optionIndex) => {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;

    const selectedOption = question.opciones[optionIndex];
    
    // Agregar respuesta a la lista
    const newAnswer = {
      preguntaId: questionId,
      puntaje: selectedOption.puntaje,
      texto: selectedOption.texto
    };
    
    const updatedAnswers = [...currentAnswers, newAnswer];
    setCurrentAnswers(updatedAnswers);
    
    // Remover la pregunta respondida de la lista actual
    const remainingQuestions = currentQuestions.filter(q => q.id !== questionId);
    setCurrentQuestions(remainingQuestions);
    
    // Si no quedan más preguntas en la etapa actual, obtener siguientes
    if (remainingQuestions.length === 0) {
      obtenerSiguientesPreguntas(updatedAnswers);
    }
  };

  const obtenerSiguientesPreguntas = async (respuestas) => {
    try {
      setLoadingQuestions(true);
      setError('');
      
      // Obtener siguientes preguntas
      const nextResponse = await getQuestionnaireNext(respuestas);
      
      if (nextResponse.success) {
        if (nextResponse.data.tipo === 'finalizado' || nextResponse.data.preguntas.length === 0) {
          // Cuestionario finalizado para este deporte, calcular initPoints
          await finalizarCuestionario(respuestas);
        } else {
          // Hay más preguntas en la siguiente etapa
          setCurrentQuestions(nextResponse.data.preguntas);
        }
      }
    } catch (error) {
      console.error("Error obteniendo siguientes preguntas:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error procesando respuesta");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const finalizarCuestionario = async (respuestas) => {
    try {
      setSaving(true);
      setError('');
      
      // Calcular initPoints desde respuestas
      const calcResponse = await calculateInitPointsFromAnswers(respuestas);
      
      if (calcResponse.success) {
        const { initPoints, nivel, nivelInfo } = calcResponse.data;
        
        // Guardar resultado para este deporte
        const result = {
          sportId: userSports[currentSportIndex].sport.id,
          sportName: userSports[currentSportIndex].sport.name,
          initPoints,
          nivel,
          nivelInfo
        };
        
        const updatedResults = [...allSportsResults, result];
        setAllSportsResults(updatedResults);
        
        // Mostrar resultado
        setCurrentResult(result);
        setShowLevelPopup(true);
      }
    } catch (error) {
      console.error("Error calculando initPoints:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError("Error calculando puntos iniciales");
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    setShowLevelPopup(false);
    setCurrentResult(null);
    
    // Verificar si hay más deportes
    if (currentSportIndex + 1 < userSports.length) {
      // Pasar al siguiente deporte
      setCurrentSportIndex(prev => prev + 1);
      setCurrentAnswers([]);
      setCurrentQuestions([]);
    } else {
      // Todos los deportes completados, guardar en backend
      guardarTodosLosResultados();
    }
  };

  const guardarTodosLosResultados = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Preparar datos para enviar
      const sportPointsData = allSportsResults.map(result => ({
        sportId: result.sportId,
        initPoints: result.initPoints
      }));
      
      const response = await setInitPoints(sportPointsData);
      if (response.success) {
        // Navegar a la selección de deporte
        navigate('/selectSport');
      } else {
        setError(response.message || "Error guardando puntos iniciales");
      }
    } catch (error) {
      console.error("Error guardando puntos iniciales:", error);
      if (handleAuthError(error, navigate)) {
        return;
      }
      setError(error.message || "Error guardando puntos iniciales");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigate('/selectSport');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AuthNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const currentSport = userSports[currentSportIndex];
  const progress = ((currentSportIndex + 1) / userSports.length) * 100;
  const totalAnswered = currentAnswers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AuthNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header con progreso */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">Configuración de Nivel</h1>
                <p className="text-blue-100 mt-1">
                  Deporte {currentSportIndex + 1} de {userSports.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{Math.round(progress)}%</div>
                <div className="text-sm text-blue-100">Completado</div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="p-6">
            {/* Deporte actual */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentSport?.sport.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Responde el cuestionario para calcular tu nivel inicial
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{totalAnswered}</div>
                  <div className="text-xs text-gray-500">Preguntas respondidas</div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">✕</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cuestionario */}
            {loadingQuestions ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : currentQuestions.length > 0 ? (
              <div className="space-y-6">
                {/* Mostrar solo la primera pregunta de la lista actual */}
                {(() => {
                  const question = currentQuestions[0];
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-sm">{totalAnswered + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {question.texto}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Pregunta {totalAnswered + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Opciones */}
                      <div className="space-y-3">
                        {question.opciones.map((opcion, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => handleAnswer(question.id, optIndex)}
                            disabled={saving || loadingQuestions}
                            className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">{opcion.texto}</span>
                              <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando cuestionario...</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={handleSkip}
                disabled={saving || loadingQuestions}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Saltar por ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de Nivel */}
      {showLevelPopup && currentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              {/* Icono de celebración */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <span className="text-3xl">🎾</span>
              </div>
              
              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¡Nivel Calculado!
              </h3>
              
              {/* Deporte */}
              <p className="text-gray-600 mb-4">
                {currentResult.sportName}
              </p>
              
              {/* Información del nivel */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  Nivel {currentResult.nivel}
                </div>
                <div className="text-sm text-gray-600">
                  {currentResult.initPoints} puntos
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Rango: {currentResult.nivelInfo.rangoMin} - {currentResult.nivelInfo.rangoMax} puntos
                </div>
              </div>
              
              {/* Mensaje descriptivo */}
              <p className="text-gray-600 mb-6">
                {currentSportIndex + 1 < userSports.length 
                  ? `Continuemos con el siguiente deporte (${currentSportIndex + 2}/${userSports.length})`
                  : '¡Has completado todos los cuestionarios!'
                }
              </p>
              
              {/* Botón para continuar */}
              <button
                onClick={handleContinue}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (currentSportIndex + 1 < userSports.length ? 'Siguiente Deporte' : 'Finalizar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InitPoints;