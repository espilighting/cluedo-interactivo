import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import WeaponCard from "./WeaponCard";

const socket = io("http://localhost:5001"); // 👈 asegúrate que este es tu puerto del backend

function App() {
  const [weapons, setWeapons] = useState([]);

  useEffect(() => {
    socket.on("weapons", (data) => {
      setWeapons(data);
    });

    // Cleanup
    return () => {
      socket.off("weapons");
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Armas Reveladas 🔫🕵️‍♂️</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {weapons.map((weapon) => (
          <WeaponCard key={weapon.name} {...weapon} />
        ))}
      </div>
    </div>
  );
}

export default App;