// src/components/WeaponCard.jsx
export default function WeaponCard({ name, revealed }) {
  return (
    <div
      className={`rounded-2xl p-4 m-2 w-40 h-40 flex items-center justify-center text-center border-4 transition-all duration-500 ${revealed ? 'border-green-500 bg-green-900' : 'border-gray-700 bg-gray-800'}`}
    >
      <span className="text-lg font-semibold">{name}</span>
    </div>
  );
}
