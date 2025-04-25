import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const AssassinVote = () => {
  const [assassinVotes, setAssassinVotes] = useState({});
  const [votingStarted, setVotingStarted] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Recuperar el voto del asesino desde localStorage
    const voted = localStorage.getItem("hasVotedAssassin") === "true";
    setHasVoted(voted);

    // Comenzar la votación
    socket.on("start-assassin-vote", () => {
      console.log("La votación del asesino ha comenzado.");
      setVotingStarted(true);
    });

    // Recibir votos actuales
    socket.on("assassin-votes", (votes) => {
      setAssassinVotes(votes);
      localStorage.setItem("assassinVotes", JSON.stringify(votes)); // Guardamos los votos en localStorage
    });

    // Resetear votación si se reinicia el juego
    socket.on("game-reset", () => {
      console.log("Reinicio de juego, reseteando voto del asesino.");
      localStorage.removeItem("hasVotedAssassin");
      localStorage.removeItem("assassinVotes");
      setHasVoted(false);
      setVotingStarted(false);
    });

    // Recuperar votos de los asesinos desde localStorage
    const storedVotes = JSON.parse(localStorage.getItem("assassinVotes"));
    if (storedVotes) {
      setAssassinVotes(storedVotes);
    }

    return () => {
      socket.off("start-assassin-vote");
      socket.off("assassin-votes");
      socket.off("game-reset");
    };
  }, []);

  const voteAssassin = (assassin) => {
    if (hasVoted) return;

    socket.emit("vote-assassin", { assassin });

    localStorage.setItem("hasVotedAssassin", "true");
    setHasVoted(true);

    alert(`Has votado por ${assassin}`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Votación del Asesino</h2>

      {votingStarted ? (
        <div>
          {!hasVoted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
              <button onClick={() => voteAssassin("Profesor Plum")}>Profesor Plum</button>
              <button onClick={() => voteAssassin("Miss Scarlet")}>Miss Scarlet</button>
              <button onClick={() => voteAssassin("Reverendo Green")}>Reverendo Green</button>
              <button onClick={() => voteAssassin("Sra. White")}>Sra. White</button>
            </div>
          ) : (
            <p style={{ fontWeight: "bold", color: "green" }}>Gracias por votar 🗳️</p>
          )}

          <h3 style={{ marginTop: "2rem" }}>Resultados actuales:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.entries(assassinVotes).map(([assassin, votes]) => (
              <li key={assassin}>
                {assassin}: {votes} voto{votes !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>La votación aún no ha comenzado.</p>
      )}
    </div>
  );
};

export default AssassinVote;
