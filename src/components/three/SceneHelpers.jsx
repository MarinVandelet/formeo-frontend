import * as THREE from "three";

/**
 * Masque ou affiche un objet dans la scène par son nom
 * @param {THREE.Scene} scene - La scène Three.js
 * @param {string[]} objectNames - Liste des noms d'objets à masquer
 * @param {boolean} visible - true pour afficher, false pour masquer
 */
export function setObjectsVisibility(scene, objectNames, visible) {
  if (!scene) return;

  scene.traverse((obj) => {
    if (obj.isMesh && objectNames.includes(obj.name)) {
      obj.visible = visible;
    }
  });
}
