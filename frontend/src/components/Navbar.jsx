import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, isAuthenticated, removeToken } from "../services/api";

function Navbar() {
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
        setUser(null);
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    // Opcional: redirigir al home
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NextMatch MVP</Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/">Inicio</Link>
        
        {loading ? (
          <span>Cargando...</span>
        ) : user ? (
          <>
            <Link to="/profile">Mi Perfil</Link>
            <span className="user-greeting">Hola, {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Registrarse</Link>
            <Link to="/login">Iniciar Sesión</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
