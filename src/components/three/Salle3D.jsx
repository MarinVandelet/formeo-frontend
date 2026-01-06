import { Suspense, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import BackgroundController from "./BackgroundController";
import VisibilityController from "./VisibilityController";
import Listener from "./Listener";



const MODEL_URL = "https://pub-1a75df19d308437a91016802c6a3adef.r2.dev/test-draco.glb";

const ClassroomModel = ({ backfaceCulling, visibleElements, onLoaded }) => {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {

    // 🔄 Rotation de 180° sur l'axe Y
  scene.rotation.y = Math.PI;

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.side = backfaceCulling ? THREE.FrontSide : THREE.DoubleSide;
        obj.material.needsUpdate = true;
      }

      
    });

    if (onLoaded) onLoaded(scene);
  }, [scene, backfaceCulling, onLoaded]);

  return <primitive object={scene} />;
};

const Salle3D = forwardRef(
  ({ backfaceCulling, backgroundColor, envMapUrl, controlsRef, visibleElements, zoomTarget }, ref) => {
    const { scene, camera } = useThree();
    const modelRef = useRef();

    // expose la fonction zoom
    useImperativeHandle(ref, () => ({
      focusObject(objectName) {
        const object = scene.getObjectByName(objectName);
        if (!object || !controlsRef.current) return;

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
      },
    }));

    // zoom automatique si zoomTarget change
    useEffect(() => {
      if (zoomTarget) {
        ref.current?.focusObject(zoomTarget);
      }
    }, [zoomTarget, ref]);

    return (
      <>
        <BackgroundController color={backgroundColor} envMapUrl={envMapUrl} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
        <Listener speed={6} />

        <VisibilityController scene={scene} visibleElements={visibleElements} />

        <Suspense
          fallback={
            <Html center>
              <p className="loading-message">Chargement de la salle, veuillez patienter...</p>
            </Html>
          }
        >
          <ClassroomModel
            backfaceCulling={backfaceCulling}
            visibleElements={visibleElements}
            onLoaded={(scene) => (modelRef.current = scene)}
          />
        </Suspense>
      </>
    );
  }
);

export default function Salle3DWrapper({ zoomTarget, ...props }) {
  const salleRef = useRef(); // ref pour Salle3D

  // Zoom automatique
  useEffect(() => {
    if (zoomTarget && salleRef.current) {
      salleRef.current.focusObject(zoomTarget);
    }
  }, [zoomTarget]);

  return (
    <Canvas className="salle-canvas" camera={{ position: [10, 5, 10], fov: 60 }}>
      <Salle3D ref={salleRef} {...props} />
    </Canvas>
  );
}

