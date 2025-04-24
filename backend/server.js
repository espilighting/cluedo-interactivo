require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { exec } = require("child_process"); // Para ejecutar el AppleScript

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

// 🧠 Estado temporal de las armas
let weapons = [
  { name: "Candelabro", revealed: false },
  { name: "Cuchillo", revealed: false },
  { name: "Pistola", revealed: false },
  { name: "Cuerda", revealed: false },
  { name: "Llave inglesa", revealed: false },
  { name: "Veneno", revealed: false },
];

// Votaciones de las armas (declarada antes de su uso)
let votes = {
  Candelabro: 0,
  Cuchillo: 0,
  Pistola: 0,
  Cuerda: 0,
  "Llave inglesa": 0,
  Veneno: 0,
};

// 🔄 WebSocket: cliente se conecta
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Envía el estado actual de las armas y votos
  socket.emit("weapons", weapons);
  socket.emit("votes", votes);

  // Escuchar el evento 'game-started' desde el frontend si fuera necesario
  socket.on("game-started", () => {
    console.log("El juego ha comenzado.");
    io.emit("game-started", { started: true }); // Emitir a todos los clientes
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// ✅ Endpoint para mostrar las instrucciones
app.post("/show-instructions", (req, res) => {
  console.log("Instrucciones mostradas");

  // Emitir el evento a todos los clientes para mostrar instrucciones
  io.emit("show-instructions", { show: true });

  res.send({ success: true });
});

// ✅ Endpoint para revelar arma desde QLab o script
app.post("/reveal", (req, res) => {
  const { name } = req.body;
  weapons = weapons.map((w) =>
    w.name === name ? { ...w, revealed: true } : w
  );

  // Emitir actualización en tiempo real
  io.emit("weapons", weapons);

  res.send({ success: true, weapons });
});

// ✅ Endpoint para iniciar el juego (comunicación con QLab)
app.post("/start-game", (req, res) => {
  console.log("El juego ha comenzado");

  // Emitir evento 'game-started' para todos los clientes
  io.emit("game-started", { started: true });

  // Ejecutar el AppleScript para quitar instrucciones y mostrar las cartas en QLab
  exec("osascript /Users/espilighting/Desktop/cle/qlab_iniciar_juego.applescript", (err, stdout, stderr) => {
    if (err) {
      console.error("Error ejecutando AppleScript:", err);
      return res.status(500).send({ success: false, error: err });
    }

    console.log("AppleScript ejecutado correctamente:", stdout);
    res.send({ success: true });
  });
});

// ✅ Endpoint para reiniciar el estado del juego
app.post("/reset-game", (req, res) => {
  console.log("Reiniciando el estado del juego...");

  // Resetear el estado de las armas a "ocultas"
  weapons = weapons.map((w) => ({ ...w, revealed: false }));

  // Resetear los votos
  votes = {
    Candelabro: 0,
    Cuchillo: 0,
    Pistola: 0,
    Cuerda: 0,
    "Llave inglesa": 0,
    Veneno: 0,
  };

  // Emitir la actualización en tiempo real para todos los clientes
  io.emit("weapons", weapons);
  io.emit("votes", votes);

  res.send({ success: true, message: "El juego ha sido reiniciado" });
});

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor del Cluedo en funcionamiento 🕵️‍♂️🔍");
});

// ✅ Endpoint para votar por un arma
app.post("/vote", (req, res) => {
  const { weapon } = req.body;  // Arma que el usuario votó
  if (votes[weapon] !== undefined) {
    votes[weapon] += 1;  // Aumenta el contador de votos de esa arma
    res.send({ success: true, votes });
  } else {
    res.status(400).send({ error: "Arma no válida" });
  }
});

// ✅ Endpoint para obtener los votos
app.get("/votes", (req, res) => {
  res.send({ votes });
});

server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
