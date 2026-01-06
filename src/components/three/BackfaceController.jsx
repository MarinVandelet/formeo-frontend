import { useEffect } from "react";
import * as THREE from "three";

export default function BackfaceController({ scene, backfaceCulling }) {
  useEffect(() => {
    if (!scene) return;

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.side = backfaceCulling ? THREE.FrontSide : THREE.DoubleSide;
        obj.material.needsUpdate = true;
      }
    });
  }, [scene, backfaceCulling]);

  return null; // invisible
}
