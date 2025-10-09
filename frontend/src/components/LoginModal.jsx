import { useState, useEffect } from 'react';
import { loginUser, saveToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

function LoginModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Limpiar form cuando se cierre
  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', password: '' });
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔵 [FRONTEND] Iniciando proceso de login...");
    console.log("🔵 [FRONTEND] Datos del formulario:", formData);
    setLoading(true);
    setError('');

    try {
      console.log("🔵 [FRONTEND] Llamando a loginUser...");
      const response = await loginUser(formData);
      console.log("🔵 [FRONTEND] Respuesta recibida:", response);
      if (response.success) {
        console.log("🔵 [FRONTEND] Login exitoso! Guardando token...");
        // Guardar token en localStorage para mantener la sesión
        saveToken(response.data.token);
        console.log("🔵 [FRONTEND] Token guardado:", response.data.token);
        
        // Verificar el estado de validación del usuario
        const validation = response.data.validation;
        console.log("🔵 [FRONTEND] Estado de validación:", validation);
        
        onClose();
        
        // Navegar según el estado de validación
        console.log("🔵 [FRONTEND] Navegando según estado:", validation.status);
        if (validation.status === 'missing_sports') {
          console.log("🔵 [FRONTEND] → Navegando a /selectSports");
          navigate('/selectSports');
        } else if (validation.status === 'missing_initpoints') {
          console.log("🔵 [FRONTEND] → Navegando a /initpoints");
          navigate('/initpoints');
        } else {
          console.log("🔵 [FRONTEND] → Navegando a /selectSport");
          // Usuario completamente configurado - ir a selección de deporte para jugar
          navigate('/selectSport');
        }
      }
    } catch (error) {
      console.log("🔴 [FRONTEND] Error en login:", error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      console.log("🔵 [FRONTEND] Finalizando proceso de login...");
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`login-modal-overlay ${isMobile ? 'mobile' : 'desktop'}`}
      onClick={handleBackdropClick}
    >
      <div className={`login-modal-container ${isMobile ? 'mobile' : 'desktop'} ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="login-modal-header">
          <h2>Iniciar Sesión</h2>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-modal-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
            
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>

          {/* Link to register */}
          <div className="register-link">
            <p>¿No tienes cuenta? <button type="button" onClick={() => {
              onClose();
              navigate('/register');
            }}>Regístrate aquí</button></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
