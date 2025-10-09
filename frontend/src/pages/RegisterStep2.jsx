import { useState, useEffect } from "react";
import { registerUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

function RegisterStep2() {
  const [form, setForm] = useState({ 
    email: "", 
    username: "", 
    department: "Montevideo", 
    password: "" 
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Departamentos de Uruguay (Montevideo primero, resto alfabético)
  const departments = [
    { value: "Montevideo", label: "Montevideo" },
    { value: "Artigas", label: "Artigas" },
    { value: "Canelones", label: "Canelones" },
    { value: "CerroLargo", label: "Cerro Largo" },
    { value: "Colonia", label: "Colonia" },
    { value: "Durazno", label: "Durazno" },
    { value: "Flores", label: "Flores" },
    { value: "Florida", label: "Florida" },
    { value: "Lavalleja", label: "Lavalleja" },
    { value: "Maldonado", label: "Maldonado" },
    { value: "Paysandu", label: "Paysandú" },
    { value: "RioNegro", label: "Río Negro" },
    { value: "Rivera", label: "Rivera" },
    { value: "Rocha", label: "Rocha" },
    { value: "Salto", label: "Salto" },
    { value: "SanJose", label: "San José" },
    { value: "Soriano", label: "Soriano" },
    { value: "Tacuarembo", label: "Tacuarembó" },
    { value: "TreintaYTres", label: "Treinta y Tres" }
  ];

  useEffect(() => {
    // Verificar que tenemos los datos del paso 1
    const step1Data = localStorage.getItem('registerStep1');
    if (!step1Data) {
      navigate('/register-step1');
    }
  }, [navigate]);

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
      // Obtener datos del paso 1
      const step1Data = JSON.parse(localStorage.getItem('registerStep1'));
      
      // Combinar datos de ambos pasos
      const completeForm = {
        ...step1Data,
        ...form
      };

      const response = await registerUser(completeForm);
      
      if (response.success) {
        setMessage("¡Registro exitoso! 🎉");
        
        // Limpiar localStorage
        localStorage.removeItem('registerStep1');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage(response.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      
      if (error.errors && Array.isArray(error.errors)) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.field] = err.message;
        });
        setErrors(newErrors);
        setMessage("Por favor corrige los errores en el formulario");
      } else {
        setMessage(error.message || "Error en el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/register-step1');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Title in body */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black mb-2">Crea tu cuenta</h1>
            <p className="text-xs text-gray-400 font-light">Paso 2 de 2</p>
          </div>

          {/* Form */}
          <div className="card">
            <form className="space-y-7" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-base"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Username y Departamento en la misma fila */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="mi_usuario"
                    value={form.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    pattern="[a-zA-Z0-9_]+"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-base"
                  />
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>

                <div className="relative">
                  <label htmlFor="department" className="block text-base font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-base"
                    style={{ width: '100%' }}
                  >
                    {departments.map(dept => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-base"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registrando...
                    </div>
                  ) : (
                    "Crear Cuenta"
                  )}
                </button>
              </div>
            </form>

            {/* Messages */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.includes("✅") || message.includes("🎉") 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {message.includes("✅") || message.includes("🎉") ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-red-400">✕</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link 
                  to="/" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterStep2;
