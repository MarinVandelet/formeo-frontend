import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ZoomController({ controlsRef, scene, targetName }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!scene || !controlsRef.current || !targetName) return;

    const object = scene.getObjectByName(targetName);
    if (!object) return;

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const direction = new THREE.Vector3(1, 1, 1).normalize();
    const distance = size * 2.5;
    const targetPosition = center.clone().add(direction.multiplyScalar(distance));

    const startPos = camera.position.clone();
    const startTarget = controlsRef.current.target.clone();
    let startTime = null;
    const duration = 1000;
    const easeOutQuad = (t) => t * (2 - t);

    const animate = (time) => {
      if (!startTime) startTime = time;
      const t = Math.min((time - startTime) / duration, 1);
      const eased = easeOutQuad(t);

      camera.position.lerpVectors(startPos, targetPosition, eased);
      controlsRef.current.target.lerpVectors(startTarget, center, eased);
      controlsRef.current.update();

      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [scene, controlsRef, targetName]);

  return null; // composant invisible
}
