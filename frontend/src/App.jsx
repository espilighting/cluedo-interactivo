import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import WeaponCard from "./WeaponCard"; // Asegúrate de tener este componente
import instruccionesImg from "./assets/instrucciones.png"; // Cambia esta ruta si tu imagen está en otra carpeta

const socket = io("http://localhost:5001"); // ⚠️ Cambia esta URL si estás en producción

function App() {
  const [weapons, setWeapons] = useState([]);         // Lista de armas
  const [gameStarted, setGameStarted] = useState(false); // Si el juego ha empezado
  const [showInstructions, setShowInstructions] = useState(false); // Si las instrucciones deben mostrarse

  useEffect(() => {
    // Comprobar el LocalStorage para saber si el juego ya ha comenzado
    const storedGameStarted = localStorage.getItem("gameStarted") === "true";
    setGameStarted(storedGameStarted);

    // Recibe el estado actual de las armas desde el backend
    socket.on("weapons", (data) => {
      console.log("Datos de armas recibidos: ", data); // Verifica que los datos de las armas estén llegando correctamente
      setWeapons(data);  // Actualizamos el estado con las armas
    });

    // Escucha el evento que inicia el juego
    socket.on("game-started", () => {
      setGameStarted(true);
      localStorage.setItem("gameStarted", "true"); // Guardamos que el juego ha comenzado
    });

    // Escucha el evento de reinicio de juego
    socket.on("game-reset", () => {
      setGameStarted(false);
      localStorage.setItem("gameStarted", "false"); // Reinicia el estado del juego
      setWeapons([]);  // Reinicia las armas
    });

    // Escucha el evento de mostrar instrucciones
    socket.on("show-instructions", (data) => {
      if (data.show) {
        setShowInstructions(true); // Mostrar instrucciones
      }
    });

    return () => {
      socket.off("weapons");
      socket.off("game-started");
      socket.off("game-reset");
      socket.off("show-instructions");
    };
  }, []);

  return (
    <div className="App">
      {!gameStarted ? (
        // Si el juego NO ha comenzado, mostramos las instrucciones
        <div style={{ textAlign: "center", padding: "2rem" }}>
          {showInstructions ? (
            <>
              <h1>Bienvenido al Cluedo</h1>
              <img
                src={instruccionesImg}
                alt="Instrucciones"
                style={{
                  maxWidth: "90%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                }}
              />
              <p>Espera a que comience el juego…</p>
            </>
          ) : (
            <p>Esperando que se muestren las instrucciones...</p>
          )}
        </div>
      ) : (
        // Si el juego ha comenzado, mostramos las armas reveladas
        <div>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <h2>Armas reveladas 🔍 ❓</h2>
            <p>Las siguientes armas han sido reveladas:</p>
          </div>
          <div
            className="weapons-grid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              padding: "2rem",
            }}
          >
            {weapons
              .filter((weapon) => weapon.revealed) // Filtra las armas reveladas
              .map((weapon) => (
                <WeaponCard key={weapon.name} name={weapon.name} revealed={weapon.revealed} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
