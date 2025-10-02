import { useEffect, useState } from 'react';

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Después de 6 segundos, iniciar animación de salida
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      
      // Esperar a que termine la animación de salida (2s) antes de llamar onComplete
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 6000);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${!isVisible ? 'splash-exit' : ''}`}>
      <img 
        src="/images/jsm-logo.png" 
        alt="JSM - Juego Set Match"
        className="splash-logo-image"
        onError={(e) => {
          // Fallback si no se encuentra la imagen
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      
      {/* Fallback text si no se carga la imagen */}
      <div className="splash-fallback" style={{ display: 'none' }}>
        <h1>JSM</h1>
        <p>JUEGO SET MATCH</p>
      </div>
    </div>
  );
}

export default SplashScreen;
