import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import Profile from "./pages/Profile";
import SelectSports from "./pages/SelectSports";
import InitPoints from "./pages/InitPoints";
import SelectSportToPlay from "./pages/SelectSportToPlay";
import SportProfile from "./pages/SportProfile";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";
import "./App.css";
import "./components/SplashScreen.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || 
                     location.pathname === '/register' || 
                     location.pathname === '/register-step1' || 
                     location.pathname === '/register-step2' || 
                     location.pathname === '/profile' ||
                     location.pathname === '/selectSports' ||
                     location.pathname === '/initpoints' ||
                     location.pathname === '/selectSport' ||
                     location.pathname.startsWith('/profile/');

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-step1" element={<RegisterStep1 />} />
        <Route path="/register-step2" element={<RegisterStep2 />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/selectSports" element={<SelectSports />} />
        <Route path="/initpoints" element={<InitPoints />} />
        <Route path="/selectSport" element={<SelectSportToPlay />} />
        <Route path="/profile/:sportId" element={<SportProfile />} />
      </Routes>
    </div>
  );
}

export default App;
