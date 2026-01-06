import { useGLTF } from "@react-three/drei";

const MODEL_URL =
  "https://pub-1a75df19d308437a91016802c6a3adef.r2.dev/Untitled.glb";

// https://pub-1a75df19d308437a91016802c6a3adef.r2.dev/test-draco.glb

useGLTF.setDecoderPath(
  "https://pub-1a75df19d308437a91016802c6a3adef.r2.dev/draco/"
);

export default function ClassroomModel({ onLoaded }) {
  const { scene } = useGLTF(MODEL_URL);

  if (onLoaded) onLoaded(scene);

  return <primitive object={scene} />;
}
