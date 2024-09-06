import { useMemo, useRef } from "react";
import { Instances, Instance, Box, useGLTF } from "@react-three/drei";
import PoissonDiskSampling from "poisson-disk-sampling";
import { Shoe } from "./components/Shoe";

const getImageData = (texture) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const { width, height } = texture.image;

  // Set canvas size to match texture size
  canvas.width = width;
  canvas.height = height;

  // Draw the image onto the canvas
  ctx.drawImage(texture.image, 0, 0, width, height);

  // Extract pixel data
  return ctx.getImageData(0, 0, width, height).data;
};

export const InstancedTrees = ({ points }) => {
  const { nodes, materials } = useGLTF("/tree.glb"); // Load shoe model directly here

  return (
    <Instances
      limit={points.length}
      geometry={nodes.Tree.geometry}
      material={materials.TreeMaterial}
    >
      {points.map((point, index) => (
        <Instance key={index} position={point} scale={[0.2, 0.2, 0.2]} />
      ))}
    </Instances>
  );
};

export const Boxes = ({ maskTexture }) => {
  const points = useMemo(() => {
    const data = getImageData(maskTexture);
    const width = maskTexture.image.width;
    const height = maskTexture.image.height;

    const sampler = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 10,
      tries: 30,
    });

    const sampledPoints = sampler.fill();
    return sampledPoints
      .map(([x, z]) => {
        const texX = Math.floor(x);
        const texY = Math.floor(z);
        const index = (texY * width + texX) * 4 + 3; // Alpha channel
        const maskValue = data[index];

        if (maskValue === 255) {
          return [(x / width) * 10 - 5, 0, (z / height) * 10 - 5];
        }
        return null;
      })
      .filter(Boolean); // Remove null entries
  }, [maskTexture]);

  return <InstancedTrees points={points} />;
};
