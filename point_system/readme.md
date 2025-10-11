import fs from "fs";
import readline from "readline";

const data = JSON.parse(fs.readFileSync("./data/preguntas.json", "utf8"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function preguntar(pregunta) {
  console.log("\n" + pregunta.texto);
  const opciones = Object.keys(pregunta.opciones);
  opciones.forEach((op, i) => console.log(`${i + 1}. ${op}`));

  const respuesta = await new Promise((resolve) => {
    rl.question("Tu opción: ", (input) => {
      const idx = parseInt(input) - 1;
      if (idx >= 0 && idx < opciones.length) resolve(opciones[idx]);
      else {
        console.log("Opción no válida, intentá de nuevo.");
        resolve(preguntar(pregunta));
      }
    });
  });

  let puntos = pregunta.opciones[respuesta];

  // Si tiene repregunta
  if (pregunta.repreguntas && pregunta.repreguntas[respuesta]) {
    const rep = pregunta.repreguntas[respuesta];
    console.log("\n↳ " + rep.texto);
    const repOps = Object.keys(rep.opciones);
    repOps.forEach((op, i) => console.log(`${i + 1}. ${op}`));

    const repResp = await new Promise((resolve) => {
      rl.question("Tu opción: ", (input) => {
        const idx = parseInt(input) - 1;
        if (idx >= 0 && idx < repOps.length) resolve(repOps[idx]);
        else {
          console.log("Opción no válida, intentá de nuevo.");
          resolve(preguntar(rep));
        }
      });
    });

    puntos += rep.opciones[repResp];
  }

  return puntos;
}

// Normaliza el puntaje (max aprox 50) a escala 0–2000
function normalizarPuntaje(puntaje, maxEsperado = 50, maxGlobal = 2000) {
  return Math.min(Math.round((puntaje / maxEsperado) * maxGlobal), maxGlobal);
}

// Convierte el rating (0–2000) a nivel (1–20) con curva logarítmica
function calcularNivel(rating) {
  // Formula: nivel = log10(1 + rating * factor)
  // ajustamos factor para que 2000 ≈ nivel 20
  const factor = 0.0035;
  const nivel = Math.round(5 * Math.log10(1 + rating * factor));
  return Math.min(Math.max(nivel, 1), 20);
}

async function main() {
  console.log("🎾 Bienvenido al Nivelador de Tenis Amateur 🎾");
  console.log("Responde las siguientes preguntas:\n");

  let puntajeTotal = 0;

  for (const pregunta of data.preguntas) {
    const puntos = await preguntar(pregunta);
    puntajeTotal += puntos;
  }

  const rating = normalizarPuntaje(puntajeTotal);
  const nivel = calcularNivel(rating);

  console.log("\n🏆 Puntaje interno:", rating, "/ 2000");
  console.log("🎯 Nivel visible:", nivel, "/ 20");
  console.log("(El puntaje se usará para actualizar tu progreso según tus partidos)");

  rl.close();
}

main();
