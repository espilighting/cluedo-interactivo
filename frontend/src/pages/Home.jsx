// src/pages/Home.jsx
import WeaponCard from "../components/WeaponCard";

const weapons = [
  { name: "Candelabro", revealed: false },
  { name: "Cuchillo", revealed: false },
  { name: "Pistola", revealed: false },
  { name: "Cuerda", revealed: false },
];

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Armas reveladas</h1>
      <div className="flex flex-wrap justify-center">
        {weapons.map((w) => (
          <WeaponCard key={w.name} name={w.name} revealed={w.revealed} />
        ))}
      </div>
    </div>
  );
}
