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
    <nav className="bg-gradient-to-r from-royal-500 to-cyan-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-bold text-white font-sans hover:text-lime-300 transition-colors">
                JSM
              </Link>
              <p className="text-cyan-100 text-sm mt-1">JuegoSetMatch</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white hover:text-lime-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Inicio
              </Link>
              
              {loading ? (
                <span className="text-cyan-200 px-3 py-2 text-sm font-medium">Cargando...</span>
              ) : user ? (
                <>
                  <Link to="/profile" className="text-white hover:text-lime-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Mi Perfil
                  </Link>
                  <span className="text-cyan-200 px-3 py-2 text-sm font-medium">
                    Hola, {user.name}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/" className="text-white hover:text-lime-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register-step1" className="bg-white text-royal-600 hover:bg-royal-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
