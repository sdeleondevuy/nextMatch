import { useState } from "react";
import { loginUser, saveToken } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const response = await loginUser(form);
      
      if (response.success) {
        // Guardar token en localStorage
        saveToken(response.data.token);
        setMessage(`¡Bienvenido ${response.data.user.name}! 🎉`);
        
        // Redirigir al dashboard o home después de 1 segundo
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Error en login:", error);
      
      // Manejar diferentes tipos de errores
      if (error.message.includes("Credenciales inválidas")) {
        setMessage("Email o contraseña incorrectos");
      } else if (error.message.includes("validation")) {
        setMessage("Por favor, corrige los errores en el formulario");
      } else {
        setMessage(error.message || "Error en el login. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Tu contraseña"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes("✅") || message.includes("🎉") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <p className="form-footer">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}

export default Login;
