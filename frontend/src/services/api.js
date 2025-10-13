const API_URL = "http://localhost:5000";

// Función helper para hacer requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Función helper para obtener token del localStorage
function getAuthToken() {
  return localStorage.getItem("token");
}

// Función helper para headers con autenticación
function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { 
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  } : {
    "Content-Type": "application/json"
  };
}

// ===== AUTH ENDPOINTS =====

export async function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getCurrentUser() {
  return apiRequest("/auth/me", {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function updateProfile(profileData) {
  return apiRequest("/auth/profile", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
}

// ===== HEALTH CHECK =====

export async function checkHealth() {
  return apiRequest("/health", {
    method: "GET",
  });
}

// ===== TOKEN MANAGEMENT =====

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getToken() {
  return getAuthToken();
}

export function isAuthenticated() {
  return !!getAuthToken();
}

// Helper function para manejar errores de autenticación
export function handleAuthError(error, navigate) {
  if (error.message.includes("Token") || error.message.includes("401")) {
    removeToken();
    navigate("/");
    return true; // Indica que se manejó el error
  }
  return false; // Error no relacionado con autenticación
}

// ===== SPORTS ENDPOINTS =====

export async function getSports() {
  return apiRequest("/sports", {
    method: "GET",
  });
}

export async function getUserSports() {
  return apiRequest("/sports/user", {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function addUserSport(sportId) {
  return apiRequest("/sports/user", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ sportId }),
  });
}

export async function removeUserSport(sportId) {
  return apiRequest(`/sports/user/${sportId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export async function updateUserSports(sportIds) {
  return apiRequest("/sports/user", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ sportIds }),
  });
}

// ===== VALIDATION ENDPOINTS =====

export async function validateUser() {
  return apiRequest("/auth/validate", {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function setInitPoints(sportPoints) {
  return apiRequest("/auth/initpoints", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ sportPoints }),
  });
}

// ===== POINT SYSTEM ENDPOINTS =====

export async function calculateLevel(puntos) {
  return apiRequest("/auth/calculate-level", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ puntos }),
  });
}

// ===== QUESTIONNAIRE ENDPOINTS =====

export async function getQuestionnaireStart() {
  return apiRequest("/auth/questionnaire/start", {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function getQuestionnaireNext(respuestas) {
  return apiRequest("/auth/questionnaire/next", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ respuestas }),
  });
}

export async function calculateInitPointsFromAnswers(respuestas) {
  return apiRequest("/auth/questionnaire/calculate", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ respuestas }),
  });
}