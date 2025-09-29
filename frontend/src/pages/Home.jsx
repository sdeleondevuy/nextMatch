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
        setUser(null);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user ? (
          // Usuario autenticado
          <div className="text-center">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sans">
                ¡Bienvenido de vuelta, {user.name}! 🎾
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Has iniciado sesión correctamente en NextMatch. Gestiona tus partidos y conecta con otros tenistas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="card text-center">
                <div className="text-4xl mb-4">🎾</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mis Partidos</h3>
                <p className="text-gray-600 mb-4">Gestiona y organiza tus partidos de tenis</p>
                <Link to="/matches" className="btn-primary inline-block">
                  Ver Partidos
                </Link>
              </div>

              <div className="card text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ranking</h3>
                <p className="text-gray-600 mb-4">Consulta las estadísticas y posiciones</p>
                <Link to="/ranking" className="btn-primary inline-block">
                  Ver Ranking
                </Link>
              </div>

              <div className="card text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mi Perfil</h3>
                <p className="text-gray-600 mb-4">Actualiza tu información personal</p>
                <Link to="/profile" className="btn-outline inline-block">
                  Ver Perfil
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Usuario no autenticado
          <div className="text-center">
            <div className="mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6 font-sans">
                ¡Bienvenido a NextMatch! 🎾
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                La plataforma definitiva para gestionar tus partidos de tenis. 
                Conecta con otros tenistas, organiza encuentros y lleva el control de tus estadísticas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Crear Cuenta Gratis
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                  Iniciar Sesión
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎾</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gestiona Partidos</h3>
                <p className="text-gray-600">Organiza y programa tus encuentros de tenis</p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rankings</h3>
                <p className="text-gray-600">Consulta estadísticas y posiciones</p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Conecta</h3>
                <p className="text-gray-600">Conoce y juega con otros tenistas</p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📱</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Multiplataforma</h3>
                <p className="text-gray-600">Acceso desde cualquier dispositivo</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h3>
              <p className="text-xl mb-8 text-green-100">
                Únete a la comunidad de NextMatch y lleva tu tenis al siguiente nivel
              </p>
              <Link to="/register" className="bg-white text-green-600 hover:bg-yellow-400 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Empezar Ahora
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-sans">NextMatch</h3>
              <p className="text-gray-300">
                La plataforma definitiva para gestionar tus partidos de tenis y conectar con otros tenistas.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/matches" className="text-gray-300 hover:text-white transition-colors">Partidos</Link></li>
                <li><Link to="/ranking" className="text-gray-300 hover:text-white transition-colors">Ranking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-gray-300 mb-2">Email: info@nextmatch.com</p>
              <p className="text-gray-300">Tel: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 NextMatch. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
