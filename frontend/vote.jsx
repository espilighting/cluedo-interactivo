import React, { useState } from "react";

function Vote() {
  const [selectedWeapon, setSelectedWeapon] = useState("");

  const handleVote = async () => {
    if (selectedWeapon) {
      try {
        const response = await fetch("http://localhost:5001/vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ weapon: selectedWeapon }),
        });

        const result = await response.json();
        if (result.success) {
          alert("Voto enviado con éxito!");
        } else {
          alert("Hubo un problema al enviar tu voto.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al enviar el voto.");
      }
    } else {
      alert("Por favor selecciona un arma.");
    }
  };

  return (
    <div>
      <h2>Vota por el arma del crimen</h2>
      <div>
        {["Candelabro", "Cuchillo", "Pistola", "Cuerda", "Llave inglesa", "Veneno"].map((weapon) => (
          <button
            key={weapon}
            onClick={() => setSelectedWeapon(weapon)}
            style={{
              backgroundColor: selectedWeapon === weapon ? "lightgreen" : "",
            }}
          >
            {weapon}
          </button>
        ))}
      </div>
      <button onClick={handleVote}>Votar</button>
    </div>
  );
}

export default Vote;
