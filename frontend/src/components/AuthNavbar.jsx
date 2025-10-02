import { Link } from "react-router-dom";
import "./AuthNavbar.css";

function AuthNavbar() {
  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-container">
        <div className="auth-navbar-content">
          {/* Back Arrow */}
          <Link to="/" className="back-arrow">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M15 18L9 12L15 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          
          {/* Logo */}
          <div className="auth-navbar-logo">
            <img 
              src="/images/company-logo.png" 
              alt="JSM Logo"
              className="logo-image"
              onError={(e) => {
                // Fallback si no se encuentra la imagen
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback text si no se carga la imagen */}
            <Link to="/" className="logo-text" style={{ display: 'none' }}>
              JSM
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
