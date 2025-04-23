require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

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

// 🧠 Estado temporal
let weapons = [
  { name: "Candelabro", revealed: false },
  { name: "Cuchillo", revealed: false },
  { name: "Pistola", revealed: false },
  { name: "Cuerda", revealed: false },
  { name: "Llave inglesa", revealed: false },
  { name: "Veneno", revealed: false },
];

// 🔄 WebSocket: cliente se conecta
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Envía el estado actual
  socket.emit("weapons", weapons);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
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

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor del Cluedo en funcionamiento 🕵️‍♂️🔍");
});

// Votaciones de las armas
let votes = {
  Candelabro: 0,
  Cuchillo: 0,
  Pistola: 0,
  Cuerda: 0,
  "Llave inglesa": 0,
  Veneno: 0,
};

// Endpoint para votar por un arma
app.post("/vote", (req, res) => {
  const { weapon } = req.body;  // Arma que el usuario votó
  if (votes[weapon] !== undefined) {
    votes[weapon] += 1;  // Aumenta el contador de votos de esa arma
    res.send({ success: true, votes });
  } else {
    res.status(400).send({ error: "Arma no válida" });
  }
});

// Endpoint para obtener los votos
app.get("/votes", (req, res) => {
  res.send({ votes });
});

server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
