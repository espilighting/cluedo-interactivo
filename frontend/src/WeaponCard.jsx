import './WeaponCard.css';
import React, { useEffect, useState } from "react";

const WeaponCard = ({ name, revealed }) => {
  const [justRevealed, setJustRevealed] = useState(false);

  useEffect(() => {
    if (revealed) {
      setJustRevealed(true);
      const timeout = setTimeout(() => {
        setJustRevealed(false);
      }, 1000); // duración del efecto

      return () => clearTimeout(timeout);
    }
  }, [revealed]);

  return (
    <div className={`weapon-card ${revealed ? 'revealed' : ''} ${justRevealed ? 'bounce flash' : ''}`}>
      <h3>{name}</h3>
      <p>{revealed ? "Revelada 🔍" : "Oculta ❓"}</p>
    </div>
  );
};

export default WeaponCard;
