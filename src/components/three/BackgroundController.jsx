import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function BackgroundController({ color = "#cccccc" }) {
  const { scene } = useThree();

  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color(color);
    }
  }, [color, scene]);

  return null; // composant invisible
}
