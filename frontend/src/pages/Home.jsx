import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import "./Home.css";

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
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
            <button 
              onClick={handleLoginClick}
              className="home-btn home-btn-login"
            >
              Iniciar Sesión
            </button>
            
            <Link 
              to="/register" 
              className="home-btn home-btn-register"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default Home;