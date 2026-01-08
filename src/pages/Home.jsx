import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-indigo-600 gap-6">

      <h1 className="text-3xl font-bold text-white">
        Salle de classe 3D
      </h1>

      <button
        onClick={() => navigate("/salle")}
        className="
          px-8 py-4
          text-base font-medium
          rounded-lg
          bg-white text-indigo-600
          shadow-lg
          transition-all duration-200
          hover:scale-105 hover:bg-indigo-100
          active:scale-95
        ">
        Entrer dans la salle
      </button>

      <div className="bg-red-500 text-white px-4 py-2 rounded">
        Tailwind OK
      </div>
    </div>
  );
}

