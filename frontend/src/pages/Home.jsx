import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container home-fade-in">
      {/* Background Image */}
      <div 
        className="home-background"
        style={{
          backgroundImage: 'url(/images/home-background.jpg)',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="home-overlay"></div>
        
        {/* Content */}
        <div className="home-content">
          {/* Action Buttons */}
          <div className="home-buttons">
            <Link 
              to="/login" 
              className="home-btn home-btn-login"
            >
              Iniciar Sesión
            </Link>
            
            <Link 
              to="/register" 
              className="home-btn home-btn-register"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;