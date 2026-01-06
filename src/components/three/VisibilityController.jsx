import { useEffect } from "react";
import { ModelDataVisi } from "../../data/ModelDataVisi";

export default function VisibilityController({ scene, visibleElements }) {
  useEffect(() => {
    if (!scene) return;

    scene.traverse((obj) => {
      // Trouver tous les modèles qui contiennent cet objet dans leur tableau objectNames
      const model = ModelDataVisi.find((m) => m.objectNames.includes(obj.name));
      if (model && obj.isMesh) {
        obj.visible = visibleElements?.[model.id] ?? true;
      }
    });
  }, [scene, visibleElements]);

  return null;
}
