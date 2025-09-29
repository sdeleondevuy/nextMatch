import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>NextMatch MVP</h1>
      <p>Bienvenido, seleccioná una opción:</p>
      <Link to="/register">
        <button>Registrarse</button>
      </Link>
      <br /><br />
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default Home;
