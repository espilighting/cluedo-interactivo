// pages/Vote.jsx
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

const suspects = [
  "Sr. Blanco",
  "Sra. Púrpura",
  "Coronel Mostaza",
  "Profesor Mora",
  "Sra. Azul",
  "Reverendo Verde",
];

export default function Vote() {
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { socket } = useSocket();

  const submitVote = () => {
    if (selectedSuspect) {
      // Enviar el voto al servidor
      socket.emit("vote", { suspect: selectedSuspect });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <div className="text-center text-xl mt-10">¡Gracias por votar!</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center mb-4">¿Quién crees que fue el asesino?</h2>
      <div className="grid grid-cols-2 gap-4">
        {suspects.map((suspect) => (
          <button
            key={suspect}
            className="p-4 bg-gray-800 text-white rounded-lg"
            onClick={() => setSelectedSuspect(suspect)}
          >
            {suspect}
          </button>
        ))}
      </div>
      <button onClick={submitVote} className="mt-6 px-6 py-2 bg-green-600 rounded-full">
        Enviar Voto
      </button>
    </div>
  );
}
