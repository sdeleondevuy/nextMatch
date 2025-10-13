// Sistema de cálculo de niveles para tenis
// Basado en el point_system desarrollado

// === CONFIGURACIÓN DE NIVELES ===
export const niveles = [
  { nivel: 1, min: 0, max: 80 },
  { nivel: 2, min: 81, max: 170 },
  { nivel: 3, min: 171, max: 260 },
  { nivel: 4, min: 261, max: 420 },
  { nivel: 5, min: 421, max: 600 },
  { nivel: 6, min: 601, max: 780 },
  { nivel: 7, min: 781, max: 930 },
  { nivel: 8, min: 931, max: 1060 },
  { nivel: 9, min: 1061, max: 1180 },
  { nivel: 10, min: 1181, max: 1300 },
  { nivel: 11, min: 1301, max: 1420 },
  { nivel: 12, min: 1421, max: 1540 },
  { nivel: 13, min: 1541, max: 1640 },
  { nivel: 14, min: 1641, max: 1720 },
  { nivel: 15, min: 1721, max: 1790 },
  { nivel: 16, min: 1791, max: 1850 },
  { nivel: 17, min: 1851, max: 1890 },
  { nivel: 18, min: 1891, max: 1930 },
  { nivel: 19, min: 1931, max: 1970 },
  { nivel: 20, min: 1971, max: 2000 },
];

// === FUNCIONES DE CÁLCULO ===

// Convierte puntos del cuestionario a rating (0-2000) usando curva logística
export function puntosARating(puntos) {
  const maxRating = 2000;
  const k = 0.12;
  const x0 = 30;
  const logistic = 1 / (1 + Math.exp(-k * (puntos - x0)));
  const rating = logistic * maxRating;
  return Math.round(rating);
}

// Busca el nivel correspondiente al rating
export function calcularNivel(rating) {
  const nivel = niveles.find((n) => rating >= n.min && rating <= n.max);
  return nivel ? nivel.nivel : 1;
}

// Función principal para calcular nivel desde puntos directos (0-2000)
export function calcularNivelDesdePuntos(puntos) {
  // Validar que los puntos estén en el rango válido
  if (puntos < 0 || puntos > 2000) {
    throw new Error('Los puntos deben estar entre 0 y 2000');
  }
  
  // Buscar el nivel correspondiente directamente
  const nivel = niveles.find((n) => puntos >= n.min && puntos <= n.max);
  return nivel ? nivel.nivel : 1;
}

// Función para obtener información completa del nivel
export function obtenerInfoNivel(puntos) {
  const nivel = calcularNivelDesdePuntos(puntos);
  const nivelInfo = niveles.find(n => n.nivel === nivel);
  
  return {
    nivel,
    puntos,
    rangoMin: nivelInfo.min,
    rangoMax: nivelInfo.max,
    descripcion: `Nivel ${nivel} (${nivelInfo.min}-${nivelInfo.max} puntos)`
  };
}
