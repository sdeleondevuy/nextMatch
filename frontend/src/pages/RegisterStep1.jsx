import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

function RegisterStep1() {
  const [form, setForm] = useState({ 
    name: "", 
    lastName: "", 
    legalId: "", 
    birthDate: "", 
    gender: "Male"
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }
    
    if (!form.legalId.trim()) {
      newErrors.legalId = "La cédula es requerida";
    } else if (!/^[0-9]+$/.test(form.legalId)) {
      newErrors.legalId = "La cédula debe contener solo números";
    }
    
    if (!form.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es requerida";
    } else {
      const birthDate = new Date(form.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.birthDate = "Debes tener al menos 13 años";
      } else if (age > 120) {
        newErrors.birthDate = "Fecha de nacimiento inválida";
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Guardar datos en localStorage y pasar al paso 2
    localStorage.setItem('registerStep1', JSON.stringify(form));
    navigate('/register-step2');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Title in body */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black mb-2">Crea tu cuenta</h1>
            <p className="text-xs text-gray-400 font-light">Paso 1 de 2</p>
          </div>

          {/* Form */}
          <div className="card">
            <form className="space-y-7" onSubmit={handleSubmit}>
              {/* Nombre y Apellido en la misma fila */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-base font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Tu apellido"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>

              {/* Cédula de identidad */}
              <div>
                <label htmlFor="legalId" className="block text-base font-medium text-gray-700 mb-2">
                  Cédula de Identidad *
                </label>
                <input
                  id="legalId"
                  name="legalId"
                  type="text"
                  placeholder="12345678"
                  value={form.legalId}
                  onChange={handleChange}
                  required
                  pattern="[0-9]+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base"
                />
                {errors.legalId && <p className="mt-1 text-sm text-red-600">{errors.legalId}</p>}
              </div>

              {/* Fecha de nacimiento y Género en la misma fila */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthDate" className="block text-base font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base"
                  />
                  {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
                </div>

                <div className="relative">
                  <label htmlFor="gender" className="block text-base font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base"
                    style={{ width: '100%' }}
                  >
                    <option value="Male">Masculino</option>
                    <option value="Female">Femenino</option>
                    <option value="Undefined">Prefiero no contestar</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            </form>

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

export default RegisterStep1;
