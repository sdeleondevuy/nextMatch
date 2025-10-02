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

  console.log('=== API Request ===');
  console.log('URL:', url);
  console.log('Config:', config);

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
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
  console.log('Token obtenido del localStorage:', token);
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

export async function addUserSport(sportUuid) {
  return apiRequest("/sports/user", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ sportUuid }),
  });
}

export async function removeUserSport(sportUuid) {
  return apiRequest(`/sports/user/${sportUuid}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export async function updateUserSports(sportUuids) {
  return apiRequest("/sports/user", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ sportUuids }),
  });
}