import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Boxes } from "./Boxes";
import { TextureLoader } from "three";

const TextureDebug = ({ texture }) => {
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial map={texture} transparent opacity={1} />
    </mesh>
  );
};

function App() {
  const maskTexture = useLoader(TextureLoader, "pattern-26399_1280.png");

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <Boxes maskTexture={maskTexture} />
      <TextureDebug texture={maskTexture} />
      <Perf matrixAutoUpdate />
    </Canvas>
  );
}

export default App;
