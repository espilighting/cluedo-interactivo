import './WeaponCard.css';
import React, { useEffect, useState } from "react";

const WeaponCard = ({ name, revealed }) => {
  const [justRevealed, setJustRevealed] = useState(false);

  useEffect(() => {
    // Si el arma se revela, activa el efecto
    if (revealed) {
      setJustRevealed(true);

      // Después de 1 segundo, quita el efecto
      const timeout = setTimeout(() => {
        setJustRevealed(false);
      }, 1000);

      // Limpieza al desmontar el componente
      return () => clearTimeout(timeout);
    }
  }, [revealed]); // Vuelve a ejecutarse si 'revealed' cambia

  return (
    <div className={`weapon-card ${revealed ? 'revealed' : ''} ${justRevealed ? 'bounce flash' : ''}`}>
      <h3>{name}</h3>
      <p>{revealed ? "Revelada 🔍" : "Oculta ❓"}</p>
    </div>
  );
};

export default WeaponCard;
