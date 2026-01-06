import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Listener({ enabled = true, speed = 5 }) {
  const { camera } = useThree();
  const keys = useRef({});

  // Gestion des touches
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e) => {
      keys.current[e.code] = true;
    };

    const onKeyUp = (e) => {
      keys.current[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled]);

  // Déplacement à chaque frame
  useFrame((_, delta) => {
    if (!enabled) return;

    const velocity = speed * delta;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // Avancer / Reculer
    if (keys.current["KeyZ"] || keys.current["KeyW"]) {
      camera.position.add(forward.clone().multiplyScalar(velocity));
    }
    if (keys.current["KeyS"]) {
      camera.position.add(forward.clone().multiplyScalar(-velocity));
    }

    // Gauche / Droite
    if (keys.current["KeyQ"] || keys.current["KeyA"]) {
      camera.position.add(right.clone().multiplyScalar(-velocity));
    }
    if (keys.current["KeyD"]) {
      camera.position.add(right.clone().multiplyScalar(velocity));
    }

    // Monter / Descendre
    if (keys.current["Space"]) {
      camera.position.y += velocity;
    }
    if (keys.current["Alt"]) {
      camera.position.y -= velocity;
    }
  });

  return null;
}
