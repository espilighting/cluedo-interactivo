import { useState } from "react";

const suspects = ["Sr. Blanco", "Sra. Púrpura", "Coronel Mostaza", "Profesor Mora", "Sra. Azul", "Reverendo Verde"];

export default function VoteForm() {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitVote = () => {
    if (selected) {
      console.log("Votado por:", selected);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <div className="text-center text-xl mt-10">¡Gracias por votar!</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl mb-4">¿Quién crees que fue el asesino?</h2>
      <div className="grid grid-cols-2 gap-4">
        {suspects.map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`p-4 rounded-xl border-2 ${selected === name ? 'border-yellow-500 bg-yellow-700' : 'border-gray-500 bg-gray-800'}`}
          >
            {name}
          </button>
        ))}
      </div>
      <button onClick={submitVote} className="mt-6 px-6 py-2 bg-green-600 rounded-full">Enviar Voto</button>
    </div>
  );
}
