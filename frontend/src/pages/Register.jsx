
import { useState } from "react";
import { registerUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const response = await registerUser(form);
      
      if (response.success) {
        setMessage("¡Registro exitoso! 🎉");
        // Limpiar formulario
        setForm({ name: "", email: "", password: "" });
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      
      // Manejar errores de validación del backend
      if (error.message.includes("validation") || error.message.includes("Error de validación")) {
        setMessage("Por favor, corrige los errores en el formulario");
      } else {
        setMessage(error.message || "Error en el registro. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Tu nombre completo"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

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
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={6}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registrando..." : "Crear Cuenta"}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes("✅") || message.includes("🎉") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <p className="form-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}

export default Register;
