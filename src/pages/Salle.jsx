import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import Menu from "../components/ui/Menu";
import Salle3D from "../components/three/Salle3D";
import { ModelData } from "../data/ModelData"; // pour le menu/zoom
import { ModelDataVisi } from "../data/ModelDataVisi"; // pour la visibilité


export default function Salle() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [backfaceCulling, setBackfaceCulling] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#cccccc");

  // Visibilité des éléments
  // créer l’état initial en inversant la logique de masquage

const defaultVisible = []; // IDs visibles par défaut

const initialVisibility = Object.fromEntries(
  ModelDataVisi.map((item) =>
    defaultVisible.includes(item.id) ? [item.id, true] : [item.id, false]
  )
);
const [visibleElements, setVisibleElements] = useState(initialVisibility);



  const menuWidth = 300;
  const navigate = useNavigate();
  const controlsRef = useRef();

  const salle3DRef = useRef();

 const [zoomTarget, setZoomTarget] = useState(null);
 const [helpOpen, setHelpOpen] = useState(false);
 



  // Easing pour déplacement fluide
  const easeOutQuad = (t) => t * (2 - t);

  const goToPositionSmooth = (targetPos, targetLookAt = [0, 0, 0], duration = 1000) => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const startPos = controls.object.position.clone();
    const startTarget = controls.target.clone();

    const endPos = new THREE.Vector3(...targetPos);
    const endTarget = new THREE.Vector3(...targetLookAt);

    let startTime = null;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutQuad(t);

      controls.object.position.lerpVectors(startPos, endPos, easedT);
      controls.target.lerpVectors(startTarget, endTarget, easedT);
      controls.update();

      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  return (
  <div className="relative w-screen h-screen overflow-hidden bg-gray-300">
    
    {/* Menu */}
    <div
      className={`absolute top-0 left-0 h-full z-20 transition-transform duration-300
      ${menuOpen ? "translate-x-0" : "-translate-x-[300px]"}`}
    >
      <Menu
        backfaceCulling={backfaceCulling}
        setBackfaceCulling={setBackfaceCulling}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        visibleElements={visibleElements}
        setVisibleElements={setVisibleElements}
        onSelectObject={(objectName) => setZoomTarget(objectName)}
      />
    </div>

    {/* Boutons latéraux */}
    <div
      className={`absolute top-4 z-30 flex flex-col gap-3 transition-all duration-300
      ${menuOpen ? "left-[315px]" : "left-5"}`}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-10 h-10 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
      >
        {menuOpen ? "←" : "→"}
      </button>

      {[2, 3, 4, 5].map((num) => (
        <button
          key={num}
          onClick={() => {
            if (num === 2) goToPositionSmooth([0, 4, 8]);
            if (num === 3) goToPositionSmooth([40, 20, 40]);
            if (num === 4) goToPositionSmooth([40, 20, 0]);
            if (num === 5) goToPositionSmooth([0, 100, 0]);
          }}
          className="w-10 h-10 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => setHelpOpen((prev) => !prev)}
        className="w-10 h-10 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
        title="Aide clavier"
      >
        ⌨️
      </button>

      <button
        onClick={() => navigate("/profil")}
        className="w-10 h-10 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600"
        title="Retour au profil étudiant"
      >
        👤
      </button>

    </div>

    {/* Canvas 3D */}
    <div className="absolute inset-0">
      <Salle3D
        backgroundColor={backgroundColor}
        backfaceCulling={backfaceCulling}
        visibleElements={visibleElements}
        controlsRef={controlsRef}
        zoomTarget={zoomTarget}
      />
    </div>

    {/* Popup aide */}
    {helpOpen && (
      <div
        className="absolute inset-0 z-40 flex items-center justify-center bg-black/50"
        onClick={() => setHelpOpen(false)} // clic à l'extérieur
      >
        <div
          className="bg-white rounded-xl w-[400px] shadow-xl"
          onClick={(e) => e.stopPropagation()} // empêche la fermeture quand on clique dedans
        >
          
          <div className="flex justify-between items-center px-4 py-3 bg-indigo-600 text-white rounded-t-xl">
            <span className="font-semibold">🎮 Aide – Commandes</span>
            <button onClick={() => setHelpOpen(false)}>✖</button>
          </div>

          <div className="p-4 text-gray-800 text-sm space-y-3">
            <div>
              <h4 className="font-semibold mb-1">⌨️ Clavier</h4>
              <ul className="list-none pl-0">
                <li>Z / W : Avancer</li>
                <li>S : Reculer</li>
                <li>Q / A : Gauche</li>
                <li>D : Droite</li>
                <li>Espace : Monter</li>
                <li>Shift : Descendre</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-1">🖱️ Souris</h4>
              <ul className="list-none pl-0">
                <li>Clic gauche : Rotation</li>
                <li>Clic droit : Déplacement</li>
                <li>Molette : Zoom</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-1">🔢 Boutons</h4>
              <ul className="list-none pl-0">
                <li><strong>1</strong> : Ouvrir / fermer le menu</li>
                <li><strong>2</strong> : Vue rapprochée</li>
                <li><strong>3</strong> : Vue générale</li>
                <li><strong>4</strong> : Vue latérale</li>
                <li><strong>5</strong> : Vue du dessus</li>
                <li><strong>6</strong> : Aide</li>
                <li><strong>⬅</strong> : Quitter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

}
