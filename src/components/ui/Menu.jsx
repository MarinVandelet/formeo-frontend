import { ModelData } from "../../data/ModelData";
import { ModelDataVisi } from "../../data/ModelDataVisi";export default function Menu({
  backfaceCulling,
  setBackfaceCulling,
  backgroundColor,
  setBackgroundColor,
  visibleElements,
  setVisibleElements,
  onSelectObject,
}) {
  return (
    <div className="h-screen w-[300px] bg-indigo-600 text-white flex flex-col p-4">
      
      {/* Header */}
      <div className="mb-4 border-b border-indigo-400 pb-3">
        <h2 className="text-xl font-bold">Salle de classe</h2>
        <p className="text-sm opacity-90">Capacité : 30 élèves</p>
        <p className="text-sm opacity-90">Mode : Présentiel</p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Mur invisible */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={backfaceCulling}
            onChange={(e) => setBackfaceCulling(e.target.checked)}
            className="accent-white"/>
          <span>Mur Invisible</span>
        </label>

        {/* Couleur fond */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Couleur du fond :</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-10 h-8 rounded cursor-pointer"
          />
        </div>


        {/* Visibilité */}
        <div>
          <h3 className="font-semibold mb-2">Éléments à afficher</h3>
          <div className="space-y-1">
            {ModelDataVisi.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleElements[item.id]}
                  onChange={() =>
                    setVisibleElements({
                      ...visibleElements,
                      [item.id]: !visibleElements[item.id],
                    })
                  }
                  className="accent-white"
                />
                <span className="capitalize">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Cartes scroll dans une zone */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Éléments de la classe</h3>

        {/* Zone scrollable avec bord et padding */}
        <div className="border border-white/30 rounded p-2 overflow-y-auto max-h-[340px]">
          <div className="grid grid-cols-2 gap-3">
            {ModelData.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectObject(item.objectName)}
                className="
                  bg-indigo-700
                  hover:bg-indigo-800
                  border border-white/70
                  rounded-sm
                  p-1
                  text-center
                  shadow-md
                  transition
                  duration-200
                  ease-out
                  hover:scale-105
                ">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-20 object-cover rounded mb-2"/>
                <span className="text-[12px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

