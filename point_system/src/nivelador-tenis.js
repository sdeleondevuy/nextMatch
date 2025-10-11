#!/usr/bin/env node

import readline from "readline";

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

// === PREGUNTAS INICIALES ===
const preguntasBase = [
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

// === FUNCIONES DE CÁLCULO ===
export function puntosARating(puntos) {
  const maxRating = 2000;
  const k = 0.12;
  const x0 = 30;
  const logistic = 1 / (1 + Math.exp(-k * (puntos - x0)));
  const rating = logistic * maxRating;
  return Math.round(rating);
}

export function calcularNivel(rating) {
  const nivel = niveles.find((n) => rating >= n.min && rating <= n.max);
  return nivel ? nivel.nivel : 1;
}

// === LÓGICA INTERACTIVA ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let indice = 0;
let puntajeTotal = 0;
let respuestasBase = []; // guarda puntajes de las preguntas iniciales

function preguntarBase() {
  const p = preguntasBase[indice];
  console.log(`\n${p.id}. ${p.texto}`);
  p.opciones.forEach((opt, i) => console.log(`  ${i + 1}) ${opt.texto}`));

  rl.question("Elegí una opción (1-" + p.opciones.length + "): ", (respuesta) => {
    const seleccion = parseInt(respuesta) - 1;
    if (seleccion >= 0 && seleccion < p.opciones.length) {
      const punt = p.opciones[seleccion].puntaje;
      puntajeTotal += punt;
      respuestasBase.push(punt);
      indice++;
      if (indice < preguntasBase.length) {
        preguntarBase();
      } else {
        segundaEtapa();
      }
    } else {
      console.log("⚠️ Opción inválida, intentá nuevamente.");
      preguntarBase();
    }
  });
}

// === SEGUNDA ETAPA CONDICIONAL ===
const preguntasExtra = [
  {
    id: 6,
    texto: "¿Qué cantidad de torneos has disputado aproximadamente?",
    opciones: [
      { texto: "Jugué uno solo para experimentar", puntaje: 0 },
      { texto: "Seguramente menos de cinco torneos", puntaje: 1 },
      { texto: "Debo estar en el entorno de los 10", puntaje: 2 },
      { texto: "Seguro llevo más de 10 torneos de singles disputados", puntaje: 4 },
    ],
    condicion: () => respuestasBase[1] > 2 && puntajeTotal > 10,
  },
  {
    id: 7,
    texto: "¿Ganaste o jugaste alguna final en los torneos disputados?",
    opciones: [
      { texto: "Nunca tuve el gusto", puntaje: 0 },
      { texto: "Una vez jugué una final", puntaje: 1 },
      { texto: "Muy pocas veces y una vez salí campeón", puntaje: 3 },
      { texto: "Normalmente defino los torneos y tengo varios títulos", puntaje: 4 },
    ],
    condicion: () =>
      respuestasBase[4] === 8 || (respuestasBase[4] === 3 && puntajeTotal > 10),
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
    condicion: () =>
      respuestasBase[5] === 8 || (respuestasBase[4] > 1 && puntajeTotal > 10),
  },{
    id: 9,
    texto: "¿Cómo son tus entrenamientos personalizados?",
    opciones: [
      { texto: "Lo hago para mejorar detalles pero no me gusta la exigencia", puntaje: 0 },
      { texto: "Aprovecho las clases para entrenar físico", puntaje: 1 },
      { texto: "Complemento mi juego desde lo físico, técnico, táctico y estrategico. Me encanta la exigencia", puntaje: 2 },
    ],
    condicion: () =>
      respuestasBase[5] > 2 && (respuestasBase[4] > 3),
  },
];

function segundaEtapa() {
  const extras = preguntasExtra.filter((p) => p.condicion());
  if (extras.length === 0) return finalizar();

  let i = 0;
  function preguntarExtra() {
    const p = extras[i];
    console.log(`\n${p.id}. ${p.texto}`);
    p.opciones.forEach((opt, idx) => console.log(`  ${idx + 1}) ${opt.texto}`));

    rl.question("Elegí una opción (1-" + p.opciones.length + "): ", (resp) => {
      const sel = parseInt(resp) - 1;
      if (sel >= 0 && sel < p.opciones.length) {
        puntajeTotal += p.opciones[sel].puntaje;
        i++;
        if (i < extras.length) {
          preguntarExtra();
        } else {
          finalizar();
        }
      } else {
        console.log("⚠️ Opción inválida, intentá nuevamente.");
        preguntarExtra();
      }
    });
  }

  preguntarExtra();
}

// === FINALIZAR ===
function finalizar() {
  const rating = puntosARating(puntajeTotal);
  const nivel = calcularNivel(rating);
  console.log("\n==============================");
  console.log(`Puntaje total: ${puntajeTotal}`);
  console.log(`Rating oculto: ${rating}`);
  console.log(`➡️  Nivel asignado: ${nivel}`);
  console.log("==============================\n");
  rl.close();
}

// === EJECUCIÓN ===
console.log("🎾 Cuestionario de nivel de tenis (Individual)");
preguntarBase();
