import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/api";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (isAuthenticated()) {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        // Si hay error, probablemente el token es inválido
        setUser(null);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1>NextMatch MVP</h1>
      
      {user ? (
        <div className="welcome-section">
          <h2>¡Bienvenido, {user.name}! 👋</h2>
          <p>Has iniciado sesión correctamente en NextMatch.</p>
          
          <div className="user-actions">
            <Link to="/profile" className="btn">
              Ver Mi Perfil
            </Link>
            <Link to="/matches" className="btn btn-secondary">
              Ver Partidos
            </Link>
            <Link to="/ranking" className="btn btn-secondary">
              Ver Ranking
            </Link>
          </div>
        </div>
      ) : (
        <div className="auth-section">
          <h2>¡Bienvenido a NextMatch! ⚽</h2>
          <p>La plataforma para gestionar tus partidos de fútbol.</p>
          
          <div className="auth-actions">
            <Link to="/register" className="btn btn-primary">
              Crear Cuenta
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Iniciar Sesión
            </Link>
          </div>
          
          <div className="features">
            <h3>¿Qué puedes hacer?</h3>
            <ul>
              <li>📊 Gestionar tus partidos</li>
              <li>🏆 Ver rankings y estadísticas</li>
              <li>👥 Conectar con otros jugadores</li>
              <li>📱 Acceso desde cualquier dispositivo</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
