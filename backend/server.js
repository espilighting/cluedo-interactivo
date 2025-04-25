require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const osc = require("osc"); // Nuevo para QLab OSC

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Votaciones del asesino
let assassinVotes = {
  "Profesor Plum": 0,
  "Miss Scarlet": 0,
  "Reverendo Green": 0,
  "Sra. White": 0,
};

// Configuración OSC para QLab
const qlabHost = "127.0.0.1"; // o la IP del Mac que corre QLab
const qlabPort = 53000; // Puerto por defecto en QLab para OSC

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121,
  remoteAddress: qlabHost,
  remotePort: qlabPort,
  metadata: true,
});

udpPort.open();

function updateQLabWithVotes(votes) {
  const resultado = Object.entries(votes)
    .map(([name, count]) => `${name}: ${count} voto${count !== 1 ? "s" : ""}`)
    .join("\n");

  // Enviar al cue llamado "VotosAsesino" en QLab
  udpPort.send({
    address: "/cue/VotosAsesino/text",
    args: [
      {
        type: "s",
        value: resultado
      }
    ]
  });

  console.log("✅ Votos enviados a QLab vía OSC:", resultado);
}

// 🔄 WebSocket: cliente se conecta
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Envía los votos del asesino al cliente conectado
  socket.emit("assassin-votes", assassinVotes);

  socket.on("client-ready", (data) => {
    console.log(data.message);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

app.post("/show-instructions", (req, res) => {
  console.log("Instrucciones mostradas");
  io.emit("show-instructions", { show: true });
  res.send({ success: true });
});

app.post("/start-game", (req, res) => {
  console.log("El juego ha comenzado");
  io.emit("game-started", { started: true });

  // Aquí podrías también mandar OSC si QLab tiene un cue de inicio
  res.send({ success: true });
});

app.post("/reset-game", (req, res) => {
  console.log("Reiniciando el estado del juego...");

  assassinVotes = {
    "Profesor Plum": 0,
    "Miss Scarlet": 0,
    "Reverendo Green": 0,
    "Sra. White": 0,
  };

  io.emit("assassin-votes", assassinVotes);
  io.emit("game-reset");

  res.send({ success: true, message: "El juego ha sido reiniciado" });
});

app.post("/start-assassin-vote", (req, res) => {
  console.log("La votación del asesino ha comenzado");
  io.emit("start-assassin-vote");
  res.send({ success: true });
});

app.post("/vote-assassin", (req, res) => {
  const { assassin } = req.body;

  if (assassinVotes[assassin] !== undefined) {
    assassinVotes[assassin] += 1;
    io.emit("assassin-votes", assassinVotes);
    updateQLabWithVotes(assassinVotes);
    res.send({ success: true, assassinVotes });
  } else {
    res.status(400).send({ error: "Asesino no válido" });
  }
});

app.get("/assassin-votes", (req, res) => {
  res.send({ assassinVotes });
});

app.get("/", (req, res) => {
  res.send("Servidor del Cluedo en funcionamiento 🕵️‍♂️🔍");
});

server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
