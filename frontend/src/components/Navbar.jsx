import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div>
        <Link to="/">NextMatch MVP</Link>
      </div>
      <div>
        <Link to="/">Inicio</Link>
        <Link to="/register">Registrarse</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
