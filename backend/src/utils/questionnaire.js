// Sistema de cuestionario para calcular initPoints
// Basado en el point_system/src/nivelador-tenis.js

// === PREGUNTAS BASE (SIEMPRE SE HACEN) ===
export const preguntasBase = [
  {
    id: 1,
    texto: "¿Cuántas veces jugás tenis a la semana en promedio?",
    opciones: [
      { texto: "Menos de una vez", puntaje: 0 },
      { texto: "1 vez a la semana", puntaje: 2 },
      { texto: "2 veces a la semana", puntaje: 3 },
      { texto: "3 o más veces a la semana", puntaje: 5 },
    ],
  },
  {
    id: 2,
    texto: "¿Competís en torneos o jugas solo con amigos?",
    opciones: [
      { texto: "Juego con amigos", puntaje: 1 },
      { texto: "Juego Torneos", puntaje: 3 },
      { texto: "Ambas cosas", puntaje: 5 },
    ],
  },
  {
    id: 3,
    texto: "¿Cuánto tiempo hace que jugás tenis?",
    opciones: [
      { texto: "Menos de 1 año", puntaje: 1 },
      { texto: "Entre 1 y 3 años", puntaje: 3 },
      { texto: "Entre 3 y 5 años", puntaje: 5 },
      { texto: "Mas de 5 años", puntaje: 8 },
    ],
  },
  {
    id: 4,
    texto: "¿Tomás clases de tenis?",
    opciones: [
      { texto: "No tomo clases", puntaje: 1 },
      { texto: "Si, tomo clases grupales regularmente", puntaje: 3 },
      { texto: "Solo tomo clases individuales", puntaje: 4 },
      { texto: "Si, tomo clases grupales e individuales", puntaje: 5 },
    ],
  },
  {
    id: 5,
    texto: "Si hoy tuvieras que anotarte a un torneo, ¿qué nivel te anotarías?",
    opciones: [
      { texto: "No me anotaría a ningún torneo, todavía no tengo el nivel", puntaje: 0 },
      { texto: "Seguramente en las de mas bajo nivel para agarrar experiencia", puntaje: 2 },
      { texto: "En una categoría entre la C y la D", puntaje: 3 },
      { texto: "Seguro categorías A o B", puntaje: 8 },
    ],
  },
];

// === PREGUNTAS EXTRA (CONDICIONALES) ===
export const preguntasExtra = [
  {
    id: 6,
    texto: "¿Qué cantidad de torneos has disputado aproximadamente?",
    opciones: [
      { texto: "Jugué uno solo para experimentar", puntaje: 0 },
      { texto: "Seguramente menos de cinco torneos", puntaje: 1 },
      { texto: "Debo estar en el entorno de los 10", puntaje: 2 },
      { texto: "Seguro llevo más de 10 torneos de singles disputados", puntaje: 4 },
    ],
    condicion: (respuestasBase, puntajeTotal) => respuestasBase[1] > 2 && puntajeTotal > 10,
  },
  {
    id: 7,
    texto: "¿Ganaste o jugaste alguna final en los torneos disputados?",
    opciones: [
      { texto: "Nunca tuve el gusto", puntaje: 1 },
      { texto: "Una vez jugué una final", puntaje: 2 },
      { texto: "Muy pocas veces y una vez salí campeón", puntaje: 5 },
      { texto: "Normalmente defino los torneos y tengo varios títulos", puntaje: 8 },
    ],
    condicion: (respuestasBase, puntajeTotal) => respuestasBase[4] === 8,
  },
  {
    id: 8,
    texto: "¿Cómo vivís el tenis?",
    opciones: [
      { texto: "Es un hobbie, normalmente no lo pienso mucho", puntaje: 0 },
      { texto: "Me gusta cuidarme para tener el mejor rendimiento posible", puntaje: 1 },
      { texto: "Además de cuidarme, veo tenis todo el tiempo y busco aprender mucho", puntaje: 2 },
      { texto: "Juego para sentir la competencias, quiero ganar y ser campeón", puntaje: 3 },
    ],
    condicion: (respuestasBase, puntajeTotal) => 
      respuestasBase[4] === 8 || (respuestasBase[4] > 1 && puntajeTotal > 10),
  },
  {
    id: 9,
    texto: "¿Cómo son tus entrenamientos personalizados?",
    opciones: [
      { texto: "Lo hago para mejorar detalles pero no me gusta la exigencia", puntaje: 0 },
      { texto: "Aprovecho las clases para entrenar físico", puntaje: 1 },
      { texto: "Complemento mi juego desde lo físico, técnico, táctico y estrategico. Me encanta la exigencia", puntaje: 2 },
    ],
    condicion: (respuestasBase, puntajeTotal) => 
      respuestasBase[3] > 2 && respuestasBase[4] > 3,
  },
  {
    id: 10,
    texto: "¿Ganaste o jugaste alguna final en los torneos disputados?",
    opciones: [
      { texto: "Nunca tuve el gusto", puntaje: 0 },
      { texto: "Una vez jugué una final", puntaje: 1 },
      { texto: "Muy pocas veces y una vez salí campeón", puntaje: 3 },
      { texto: "Normalmente defino los torneos y tengo varios títulos", puntaje: 4 },
    ],
    condicion: (respuestasBase, puntajeTotal) => 
      respuestasBase[4] === 3 && puntajeTotal > 10,
  },
];

// === PREGUNTAS AVANZADAS (CONDICIONALES) ===
export const preguntasAvanzadas = [
  {
    id: 11,
    texto: "Veo que el tenis es muy importante para vos, vamos a afinar tu nivel un poco mas, ¿Jugaste alguna vez torneos internacionales?",
    opciones: [
      { texto: "Nunca, lo veo muy lejanos", puntaje: 0 },
      { texto: "No, pero lo tengo en mente proximamente", puntaje: 2 },
      { texto: "Alguna vez he jugado pero sin mucho éxito", puntaje: 4 },
      { texto: "Si, juego torneos internacionales y he sido campeón", puntaje: 8 },
    ],
    condicion: (respuestasBase, puntajeTotal) => 
      respuestasBase[4] === 8 && puntajeTotal > 35,
  },
  {
    id: 12,
    texto: "Si tuvieras que describir la situación actual de tu tenis, ¿cómo lo describirías?",
    opciones: [
      { texto: "Me cuesta mucho ganar en los torneos exigentes, pero a la vez es emocionante", puntaje: 0 },
      { texto: "Normalmente las primeras rondas me resultan accesibles, luego la historia es otra", puntaje: 1 },
      { texto: "Suelo ser quien impone el ritmo en los partidos y domino el juego", puntaje: 2 },
      { texto: "Cuando estoy en un buen día, creo que a nivel amateur puedo ganar contra cualquiera", puntaje: 5 },
    ],
    condicion: (respuestasBase, puntajeTotal) => 
      respuestasBase[4] === 8 && puntajeTotal > 40,
  },
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

// Función para obtener preguntas dinámicamente según respuestas
export function obtenerPreguntasSiguientes(respuestasBase, puntajeTotal) {
  // Siempre retornamos las preguntas base si no hay respuestas
  if (!respuestasBase || respuestasBase.length === 0) {
    return {
      tipo: 'base',
      preguntas: preguntasBase
    };
  }

  // Si tenemos 5 respuestas base, evaluamos preguntas extra
  if (respuestasBase.length === 5) {
    const preguntasFiltradas = preguntasExtra.filter(p => 
      p.condicion(respuestasBase, puntajeTotal)
    );
    
    if (preguntasFiltradas.length > 0) {
      return {
        tipo: 'extra',
        preguntas: preguntasFiltradas
      };
    }
  }

  // Si tenemos más de 5 respuestas, evaluamos preguntas avanzadas
  if (respuestasBase.length > 5) {
    const preguntasFiltradas = preguntasAvanzadas.filter(p => 
      p.condicion(respuestasBase, puntajeTotal)
    );
    
    if (preguntasFiltradas.length > 0) {
      return {
        tipo: 'avanzada',
        preguntas: preguntasFiltradas
      };
    }
  }

  // No hay más preguntas
  return {
    tipo: 'finalizado',
    preguntas: []
  };
}

// Función para calcular el initPoints final desde respuestas
export function calcularInitPointsDesdeRespuestas(respuestas) {
  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    throw new Error('Las respuestas deben ser un array con al menos una respuesta');
  }

  // Sumar todos los puntajes
  const puntajeTotal = respuestas.reduce((sum, r) => sum + r.puntaje, 0);
  
  // Convertir a rating (0-2000)
  const rating = puntosARating(puntajeTotal);
  
  return rating;
}
